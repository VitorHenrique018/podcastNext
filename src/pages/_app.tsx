import { Header } from "../components/header";
import { Player } from "../components/Player";
import "../styles/global.scss";
import styles from "../styles/app.module.scss";

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
      <Player />
    </div>
  );
}

export default MyApp;

//basicamente um arquivo global, fica envlto de todas as rotas
//Para algum componente aparecer em toda a aplicação,
//ele deve estar no _app.tsx
