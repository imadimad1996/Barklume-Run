import './styles/ui.css';
import { createGame } from './game/Game';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app root');

const wrap = document.createElement('div');
wrap.id = 'game-shell';
app.appendChild(wrap);

createGame(wrap);
