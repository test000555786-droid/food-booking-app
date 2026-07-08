async function check() {
  const res = await fetch('http://localhost:3000/api/tables/cmr3rijpc0002icczbukjiz3n/session', { cache: 'no-store' });
  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Data:', data);
}
check().catch(console.error);
