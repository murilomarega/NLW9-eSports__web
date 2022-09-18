import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import logo from './assets/logo-nlw-esports.svg';
import { CreateAdBanner } from './components/CreateAdBanner';
import { CreateAdModal } from './components/CreateAdModal.tsx';
import { Input } from './components/Form/Input';
import { GameBanner } from './components/GameBanner';
import './styles/main.css';
import 'react-toastify/dist/ReactToastify.css';

export interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  };
}

function App() {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [findGame, setFindGame] = useState<Game[]>([]);

  useEffect(() => {
    axios('http://192.168.3.4:3333/games').then((response) => {
      setGamesList(response.data);
      setFindGame(response.data);
    });
  }, []);

  function handleFilter(e: ChangeEvent<HTMLInputElement>) {
    setFindGame(
      gamesList.filter((game) =>
        game.title.toLowerCase().match(e.target.value.toLowerCase())
      )
    );
  }

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-10">
      <img src={logo} />
      <h1 className="text-6xl text-white font-black mt-10">
        Seu{' '}
        <span className="text-transparent bg-nlw-gradient bg-clip-text">
          duo
        </span>{' '}
        está aqui.
      </h1>

      <div className="text-white mt-16 w-1/3 flex">
        <Input
          placeholder="Encontre seu jogo pelo nome"
          onChange={(e) => handleFilter(e)}
        />
      </div>

      <div className="grid grid-cols-6 gap-6 mt-10">
        {findGame.map((game) => (
          <GameBanner
            key={game.id}
            bannerUrl={game.bannerUrl}
            title={game.title}
            adsCount={game._count.ads}
          />
        ))}
      </div>

      <Dialog.Root>
        <CreateAdBanner />
        <CreateAdModal />
      </Dialog.Root>
    </div>
  );
}

export default App;
