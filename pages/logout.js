import nookies from 'nookies';

export default function LogoutScreen() {
  return (
    <div>...</div> 
  );
 }

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  console.log(token);
  if(token) {
     nookies.destroy (context, 'USER_TOKEN')
  }
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }
}