import { GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import styles from "./home.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAT: string;
};

type HomeProps = {
  lastedEpisodes: Episode[];
  allEpisodes: Episode[];
};

//pegou o props da funcao abaixo
export default function Home({ lastedEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.lastedEpisodes}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {lastedEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAT}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar Episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
          <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                  <tr key={episode.id}>
                    <td>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <a href="">{episode.title}</a>                   
                    </td>
                    <td>{episode.members}</td>
                    <td>{episode.publishedAT}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar Episódio" />
                      </button>
                    </td>

                  </tr>
                )
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
//SSR - os dados ja aparecem antes da tela aparecer pro usuario
//O next entende que essa funcao deve ser executada antes de tudo
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });
  //editar a data
  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAT: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });
  //parseISO, pega uma data e converte pra um date do JS

  const lastedEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastedEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //a cada 8 horas,não há chamada para a API
  };
};
