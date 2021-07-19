
import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades) {
  return(
      <Box>
        <img src={`https://github.com/${propriedades.usuarioAleatorio}.png`} style={{ borderRadius: '8px' }} />
        <hr />
        <a className="boxLink" href={`https://github.com/${propriedades.usuarioAleatorio}`}>
          @{propriedades.usuarioAleatorio}
        </a>
        <hr />
        <AlurakutProfileSidebarMenuDefault />
      </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
     {/*  {propriedades.items.map((itemAtual) => {
        return (
          <li key={itemAtual}>
          <a href={`https://github.com/${itemAtual}.png`}>
            <img src={`https://github.com/${itemAtual}.png`} />
            <span>{itemAtual}</span>
          </a>
        </li>
        )
      })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const token = '496f3f471f6d1b95e86f2f0ae0223f';
  const usuarioAleatorio = props.githubUser;

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  const [communities, setCommunities] = React.useState([]);
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function() {
    fetch('https://api.github.com/users/peas/followers')
        .then(function (respostaDoServidor) {
            if (respostaDoServidor.ok) { 
              return respostaDoServidor.json();
            }
            throw new Error('Aconteceu um erro');
        }).then(function (respostaCompleta) {
            setSeguidores(respostaCompleta);
        });

    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: '{ allCommunities { id title imageUrl url creatorSlug } }'
        }),
      }
    )
    .then(res => res.json())
    .then((res) => {
      setCommunities(res.data.allCommunities);
    })
    .catch((error) => {
      console.log(error);
    });

  }, []);
  
  return (
    <div>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea'}}>
        <ProfileSidebar usuarioAleatorio={usuarioAleatorio} />
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">Bem vindo(a)</h1>
          <OrkutNostalgicIconSet />
        </Box>

        <Box>
          <h2 className="subTitle">O que você deseja fazer ?</h2>
          <form onSubmit={function handleCriaComunidade(e) {
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl:  dadosDoForm.get('image'),
              url: dadosDoForm.get('url'),
              creatorSlug: usuarioAleatorio
            };

            fetch('/api/comunidades', {
              method: 'POST',
              body: JSON.stringify(comunidade),
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(async (response) => {
              const dados = await response.json();
              console.log(dados);
              const comunidadeReturn = dados.recordCreated;
            //  const comunidadesAtualizadas = [...communities, comunidadeReturn];
             // setCommunities(comunidadesAtualizadas);
            })
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua propriedade ?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua propriedade" />
            </div>
            <div>
              <input 
                placeholder="Coloque uma imagem para usarmos de capa ?" 
                name="image" 
                aria-label="Coloque uma imagem para usarmos de capa" />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL ?" 
                name="url" 
                aria-label="Coloque uma URL" />
            </div>
            <button>
              Criar comunidade
            </button>
          </form>
        </Box>

      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox items={seguidores} title='Seguidores' />
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({communities.length})
          </h2>
          <ul>
          {communities.slice(0,6).map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
              <a href={itemAtual.url}>
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
            )
          })}
          </ul>
        </ProfileRelationsBoxWrapper>
        
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
          {pessoasFavoritas.slice(0,6).map((itemAtual) => {
            return (
              <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={`https://github.com/${itemAtual}.png`} />
                <span>{itemAtual}</span>
              </a>
            </li>
            )
          })}
          </ul>
        </ProfileRelationsBoxWrapper>
     
      </div>
    </MainGrid>
    </div>
  )
}


export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then( (resposta) => resposta.json());

  console.log(isAuthenticated);

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  
  const { githubUser } = jwt.decode(token);

  return {
    props: {
      githubUser
    }
  }
}