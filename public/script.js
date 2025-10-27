const input = document.getElementById('input');
const messages = document.getElementById('messages');
const send = document.getElementById('send');
const toggle = document.getElementById('toggle');
const chat = document.getElementById('chat');

toggle.addEventListener('click', () => {
  const open = chat.style.display === 'block';
  chat.style.display = open ? 'none' : 'block';
  chat.setAttribute('aria-hidden', open ? 'true' : 'false');
  if (!open) setTimeout(() => appendBot('Opa! Eu sou o Potiboy 🤖 — seu parceiro Potiguar pra cuidar da sua casa. Como posso te ajudar hoje?'), 300);
});

send.addEventListener('click', sendMessage);
input.addEventListener('keydown', (e) => { if(e.key==='Enter') sendMessage(); });

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  appendUser(text);
  input.value = '';
  appendBot('Carregando resposta do Potiboy...');

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    appendBot(data.reply);
  } catch (e) {
    appendBot('Opa, deu ruim! Não consegui processar sua mensagem agora.');
  }
}

function appendUser(text){
  const div = document.createElement('div'); div.className='msg user';
  const b = document.createElement('div'); b.className='bubble user'; b.textContent=text;
  div.appendChild(b); messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
}

function appendBot(text){
  const div = document.createElement('div');
  div.className = 'msg bot';

  const b = document.createElement('div');
  b.className = 'bubble bot';

  // Detecta se há link no formato [link=URL]Texto[/link] e transforma em botão clicável
  const formattedText = text.replace(
    /\[link=(.*?)\](.*?)\[\/link\]/g,
    `<a href="$1" target="_blank" class="chat-link-btn">$2</a>`
  );

  b.innerHTML = formattedText; // Usa innerHTML para permitir o botão

  const s = document.createElement('div');
  s.className = 'small';
  s.textContent = '— Sou o Potiboy IA, seu parceiro Potiguar pra cuidar da sua casa!';

  b.appendChild(s);
  div.appendChild(b);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
