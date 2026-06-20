import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurantId = user.restaurantId;

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await prisma.order.count({
      where: {
        restaurantId,
        createdAt: { gte: today, lt: tomorrow },
      },
    });

    const todayOrderData = await prisma.order.findMany({
      where: {
        restaurantId,
        createdAt: { gte: today, lt: tomorrow },
        status: { not: "CANCELLED" },
      },
      include: { items: true },
    });

    const todayRevenue = todayOrderData.reduce((sum, order) => {
      return sum + order.items.reduce((s, item) => s + Number(item.unitPrice) * item.quantity, 0);
    }, 0);

    // Active tables (tables with active orders)
    const activeTables = await prisma.order.groupBy({
      by: ["tableId"],
      where: {
        restaurantId,
        status: { notIn: ["SERVED", "CANCELLED"] },
      },
    });

    const totalMenuItems = await prisma.menuItem.count({ where: { restaurantId } });
    const pendingReviews = await prisma.review.count({ where: { restaurantId, isVisible: false } });
    const totalStaff = await prisma.staffUser.count({ where: { restaurantId } });

    // Daily report for last 7 days
    const dailyReports = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayOrders = await prisma.order.findMany({
        where: {
          restaurantId,
          createdAt: { gte: date, lt: nextDate },
          status: { not: "CANCELLED" },
        },
        include: { items: true },
      });

      const totalRevenue = dayOrders.reduce((sum, order) => {
        return sum + order.items.reduce((s, item) => s + Number(item.unitPrice) * item.quantity, 0);
      }, 0);

      dailyReports.push({
        date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        totalOrders: dayOrders.length,
        totalRevenue,
        averageOrderValue: dayOrders.length > 0 ? Math.round(totalRevenue / dayOrders.length) : 0,
      });
    }

    return NextResponse.json({
      todayOrders,
      todayRevenue,
      activeTables: activeTables.length,
      totalMenuItems,
      pendingReviews,
      totalStaff,
      dailyReports,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
