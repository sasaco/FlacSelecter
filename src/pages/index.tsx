export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/input',
      permanent: true,
    },
  };
}

export default function Home() {
  return null;
}
