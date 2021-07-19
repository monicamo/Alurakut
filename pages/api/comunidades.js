import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

  if (request.method === 'POST') {
    const TOKEN = '496f3f471f6d1b95e86f2f0ae0223f';
    const client = new SiteClient(TOKEN);

    console.log(request);

    const recordCreated = await client.items.create({
      itemType: "975142",
      ...request.body
 
    });
   // console.log(request);
  //  console.log(recordCreated);
  //minogo6398@nhmty.com

    response.json({
      dado: 'Algum dado qualquer',
      recordCreated: recordCreated
    });
  return;
  }

  response.status(404).json({
    message: "Ainda não temos nada no GET, mas no POST tem!"
  });
 }