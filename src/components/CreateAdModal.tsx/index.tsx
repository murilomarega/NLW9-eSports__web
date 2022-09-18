import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';
import { ArrowDown, Check, GameController } from 'phosphor-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Game } from '../../App';
import { Input } from '../Form/Input';

export function CreateAdModal() {
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string>('');

  useEffect(() => {
    axios('http://192.168.3.4:3333/games').then((response) => {
      setGamesList(response.data);
    });
  }, []);

  function showToast(text: string, type: 'error' | 'success' = 'success') {
    toast(text, {
      theme: 'dark',
      type,
      pauseOnHover: true,
    });
  }

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    if (
      !data.name ||
      !data.yearsPlaying ||
      !data.hourEnd ||
      !data.hourStart ||
      !data.discord ||
      weekDays.length === 0
    ) {
      showToast(
        'Olá viajante! Preencha todas as informções para começar a buscar seu novo duo!',
        'error'
      );
      return;
    }
    try {
      await axios
        .post(`http://192.168.3.4:3333/games/${gameId}/ads`, {
          name: data.name,
          yearsPlaying: Number(data.yearsPlaying),
          weekDay: weekDays.map(Number),
          useVoiceChannel: useVoiceChannel,
          hourEnd: data.hourEnd,
          hourStart: data.hourStart,
          discord: data.discord,
        })
        .then(() => {
          showToast(
            'Muito bom viajante! Seu anúncio já está pronto para que outros viajantes te encontrem!'
          );
        });
    } catch (error:any) {
      showToast(
        'Ops, houve algum erro durante o caminho da criação da sua busca pelo duo perfeito :(\nTente novamente dentro de alguns minutos!',
        'error'
      );
      throw new Error(error)
    }
  }

  return (
    <>
      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="bg-black/60 inset-0 fixed" />
        <Dialog.DialogContent className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-black/25">
          <Dialog.DialogTitle className="text-2xl text-white font-black">
            Publique um anúncio
          </Dialog.DialogTitle>
          <form className="mt-8 flex flex-col gap-4" onSubmit={handleCreateAd}>
            <div className="flex flex-col gap-2 relative">
              <label htmlFor="game" className="font-semibold">
                Qual o game?
              </label>
              <Select.Root onValueChange={setGameId}>
                <Select.Trigger
                  aria-label="Game"
                  className="flex items-center justify-between bg-zinc-900 py-3 px-4 rounded text-sm "
                >
                  <Select.Value
                    placeholder="Selecione o game que deseja jogar"
                    className="text-zinc-500"
                  />
                  <Select.Icon>
                    <ArrowDown />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content className="w-full pt-3 px-9 overflow-hidden rounded-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0">
                  <Select.Viewport className="p-1">
                    {gamesList.map((game) => (
                      <Select.SelectItem
                        key={game.id}
                        value={game.id}
                        className="flex items-center py-3 px-4 text-sm bg-zinc-900 hover:bg-zinc-800"
                      >
                        <Select.SelectItemIndicator className="left-0 w-6 inline-flex items-center content-center">
                          <Check />
                        </Select.SelectItemIndicator>
                        <Select.SelectItemText>
                          {game.title}
                        </Select.SelectItemText>
                      </Select.SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
              {/* <Input id="game" placeholder="Selecione o game que deseja jogar" /> */}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name">Seu nome (ou nickname)</label>
              <Input
                id="name"
                name="name"
                placeholder="Como te chamam dentro do game?"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                <Input
                  id="yearsPlaying"
                  name="yearsPlaying"
                  type="number"
                  placeholder="Tudo bem ser ZERO!"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="discord">Qual o seu discord?</label>
                <Input
                  id="discord"
                  name="discord"
                  type="text"
                  placeholder="Usuário#0000"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="weekDays">Quando costuma jogar?</label>

                <ToggleGroup.Root
                  type="multiple"
                  className="grid grid-cols-4 gap-2"
                  onValueChange={setWeekDays}
                  value={weekDays}
                >
                  <ToggleGroup.ToggleGroupItem
                    value="0"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Domingo"
                  >
                    D
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="1"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Segunda"
                  >
                    S
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="2"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Terça"
                  >
                    T
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="3"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Quarta"
                  >
                    Q
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="4"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Quinta"
                  >
                    Q
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="5"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Sexta"
                  >
                    S
                  </ToggleGroup.ToggleGroupItem>
                  <ToggleGroup.ToggleGroupItem
                    value="6"
                    className={`w-8 h-8 rounded ${
                      weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'
                    }`}
                    title="Sábado"
                  >
                    S
                  </ToggleGroup.ToggleGroupItem>
                </ToggleGroup.Root>
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label>Qual horário do dia?</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="hourStart"
                    name="hourStart"
                    type="time"
                    placeholder="De"
                  />
                  <Input
                    id="hourEnd"
                    name="hourEnd"
                    type="time"
                    placeholder="até"
                  />
                </div>
              </div>
            </div>

            <label className="mt-2 flex gap-2 text-sm">
              <Checkbox.Root
                checked={useVoiceChannel}
                onCheckedChange={(checked) =>
                  setUseVoiceChannel(checked === true ? true : false)
                }
                className="w-6 h-6 rounded bg-zinc-900 p-1"
              >
                <Checkbox.Indicator>
                  <Check className="w-4 h-4 text-emerald-400" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              Costumo me conectar ao chat de voz
            </label>

            <footer className="mt-4 flex justify-end gap-4">
              <Dialog.DialogClose
                type="button"
                className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
              >
                cancelar
              </Dialog.DialogClose>
              <button
                type="submit"
                className="flex items-center gap-3 bg-violet-500 px-5 h-12 rounded-md font-semibold hover:bg-violet-600"
              >
                <GameController className="h-6 w-6" /> Encontrar duo
              </button>
            </footer>
          </form>
        </Dialog.DialogContent>
      </Dialog.DialogPortal>
      <div>
        <ToastContainer />
      </div>
    </>
  );
}
