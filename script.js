const app = document.querySelector('#app');
const particles = document.querySelector('#particles');
const STORE = 'romantic-emilia-progress-v1';
const START_DATE = '2026-07-01T00:00:00'; // Легко изменить дату начала отношений.
const greetings = ['Добро пожаловать, любимая ❤️','Добро пожаловать, Эмилия ❤️','Привет, солнышко ☀️','Рад снова видеть тебя ❤️','Добро пожаловать, звездочка ⭐'];
const challenges = [
'Скинь последнее фото из галереи (не скрин).','Скинь последний скриншот, который ты делал(а).','Скинь самое старое своё фото, которое сохранилось в телефоне.','Отправь мне последнюю песню, которая играла в наушниках.','Скинь фото того, что сейчас лежит рядом с тобой (кроме телефона).','Сфоткай то, что видишь сейчас за окном.','Скинь свою любимую гифку, которая описывает твоё настроение.','Отправь мне одно голосовое — без слов, просто дыши 10 секунд.','Скини фото своей старой игрушки из детства.','Сфоткай свою ладонь и скинь мне.','Что ты чувствуешь, когда я долго не отвечаю на сообщение — тревогу, раздражение или всё равно?','Ты когда-нибудь хотел(а), чтобы я приревновал(а) тебя? Если да — то когда и зачем?','Если бы я честно признался(лась), что мне не хватает одной вещи в наших отношениях, — что бы, по-твоему, я назвал(а)?','Ты помнишь самый первый момент, когда ты понял(а), что тебе не всё равно, как я на тебя смотрю? Опиши его.','Было ли такое, что ты хотел(а) от меня чего-то прямо сейчас, но не попросил(а), потому что боялся(ась) выглядеть глупо?','Если бы я спросил(а) тебя: «Чего ты боишься в нас больше всего?» — что бы ты ответила честно, без фильтра?','Ты чувствуешь, когда я устал(а) от тебя, даже если я не показываю? Или тебе кажется, что я всегда рад(а) тебя видеть?','Что я делаю, когда злюсь, что тебя одновременно пугает и заводит?','Ты когда-нибудь думала, что у нас может не получиться, просто потому что мы слишком похожи или слишком разные?','Если бы сейчас я попросил(а) тебя сказать одну фразу, которая определит наш вечер, — что бы это была за фраза?','Что я сказал(а) сегодня такого, что ты запомнил(а)?','Какое моё сообщение ты перечитал(а) больше 2 раз?','Когда ты смотришь на мои фото, что ты чувствуешь первым?','Что я делаю чаще: смешу тебя или бешу?','О чём ты думаешь, когда я долго не отвечаю?','Как зовут твоего лучшего друга (и сколько лет знакомы)?','Какой фильм я тебе советовал(а), а ты так и не посмотрел(а)?','Что тебе нравится во мне больше всего, когда я молчу?','Кто первый сказал «спокойной ночи» вчера?','Как часто ты проверяешь мои новые фото?','Напиши мне комплимент, которого ты никогда не говорил(а).','Опиши цвет моих глаз тремя словами.','Напиши одно слово, которое ассоциируется со мной.','Скинь мне песню, которая напоминает тебе обо мне.','Придумай мне прозвище, которое будешь использовать только ты.','Напиши мне первое, что пришло в голову за 3 секунды.','Напиши мне, чего ты сегодня ждал(а) от меня, но не сказал(а).','Отправь мне эмодзи, которые описывают твоё настроение сейчас.','Нарисуй что-нибудь пальцем на экране и скинь скрин.','Напиши мне 3 вещи, которые ты любишь во мне (без внешности).','Что ты чувствуешь, когда мы молчим в переписке и никто не пишет первым?','Было ли тебе когда-нибудь стыдно за меня при других?','Что я мог(ла) бы сделать, чтобы ты чувствовал(а) себя со мной спокойнее?','Ты боишься, что я могу измениться? Если да — то как?','Что для тебя хуже: когда я слишком холоден(на) или слишком навязчив(а)?','Что ты хотел(а) бы услышать от меня прямо сейчас?','Какую одну вещь я мог(ла) бы делать чаще, чтобы ты чувствовал(а) себя любимым(ой)?','Есть ли у тебя вопрос, который ты боишься мне задать?','Ты чувствуешь, что мы подходим друг другу по темпу жизни или кто-то быстрее/медленнее?','Что бы ты хотела изменить в наших отношениях прямо сейчас, если бы могла одним движением?'
];

const sentencePrompts = [
'«Когда я скучаю по тебе, я первым делом...»',
'«Иногда мне кажется, что ты не замечаешь, как я...»',
'«Если честно, я ревную тебя, когда ты...»',
'«Моё любимое время суток с тобой — это... потому что...»',
'«Одна вещь, которую я никогда не скажу тебе в лицо, но думаю о ней — это...»',
'«Я перечитываю наши старые переписки, когда...»',
'«Если бы я был(а) чуть смелее, я бы сделал(а) с тобой...»',
'«Меня бесит в тебе, что ты... но это же и нравится больше всего...»',
'«Я понимаю, что влюбился(ась) в тебя по-настоящему, когда...»',
'«Мне хочется обнять тебя сильнее всего, когда ты...»',
'«Одна фраза, которую я хочу услышать от тебя перед сном сегодня — это...»',
'«Если бы я мог(ла) показать тебе одно место, где я вырос(ла), это было бы... потому что...»',
'«Я стесняюсь попросить тебя о том, чтобы ты...»',
'«Самый неловкий момент с тобой случился, когда мы...»',
'«Мне кажется, что мы слишком мало делаем вместе...»',
'«Одна вещь, которую я хочу сделать с тобой, но боюсь предложить — это...»',
'«Когда ты задерживаешься с ответом, я думаю...»',
'«Самое тёплое, что я чувствую рядом с тобой — это...»',
'«Я бы хотел(а), чтобы ты запомнил(а) навсегда, как я...»',
'«Если бы мы встретились на 5 лет позже, я бы сказал(а) тебе...»',
'«Когда я злюсь, я больше всего хочу, чтобы ты...»',
'«Моё самое тёплое воспоминание за эту неделю связано с тем, что ты...»',
'«Если бы я мог(ла) сейчас загадать одно желание, которое касается только нас двоих, я бы загадал(а)...»',
'«Одна вещь, которую я делаю, когда думаю о тебе, но никому не рассказываю — это...»',
'«Самое глупое, что я хотел(а) бы сделать с тобой в ближайшее время — это...»'
];

const soulTalkQuestions = [
'Когда ты смотришь на меня и думаешь: «Боже, какой же он дурак» — это чаще от смеха или от нежности?',
'Если бы мы сидели сейчас в моей комнате, ты бы сидела рядом на кровати или на полу, опершись спиной о кровать? И что бы ты делала руками?',
'Если бы я заснул у тебя на плече, а ты не могла бы пошевелиться, сколько бы ты вытерпела, прежде чем разбудить меня?',
'Ты когда-нибудь перечитываешь наши старые сообщения просто так, без повода? Если да — какие чаще всего?',
'Бывает, что ты пишешь мне сообщение, стираешь его и пишешь другое? О чём было то, первое?',
'Что я делаю, когда мы гуляем, что заставляет тебя хотеть взять меня за руку, но ты не берёшь?',
'Если бы я сказал тебе: «Давай сегодня не будем говорить о школе, друзьях и родителях — только о нас» — о чём бы ты заговорила первой?',
'Случалось ли тебе ловить себя на мысли, что ты скучаешь по моему голосу, а не по сообщениям? В какие моменты?',
'Что я делаю, когда злюсь, что тебя одновременно бесит и умиляет?',
'Если бы я пришёл к тебе без предупреждения в плохом настроении и просто сел молчать — ты бы спросила, что случилось, или просто села рядом и тоже молчала?',
'Назови момент, когда я сказал или сделал что-то, что ты до сих пор вспоминаешь и улыбаешься, а я даже не знаю об этом.',
'Что из того, что я говорю, ты никогда не рассказываешь подругам, потому что это только наше?',
'Бывает, что я веду себя как младше своих лет? В какие моменты это происходит и что ты при этом чувствуешь?',
'Если бы я научился делать что-то одно ради тебя (не ради себя) — что бы ты попросила?',
'Что для тебя тяжелее: когда я слишком много говорю, или когда я слишком долго молчу в переписке?'
];


// Вопросы для мини-игры «Это или то».
// Каждый уровень хранит свой независимый список вопросов.
const thisOrThatEasyQuestions = [
  "Поцеловать меня в шею, когда я сплю, или разбудить меня поцелуем, глядя в глаза? (Без варианта «не будить»)",
  "Услышать от меня шёпотом что-то очень личное, но потом я сделаю вид, что ничего не говорил(а), или чтобы я сказал(а) это громко при всех, но потом объяснил(а), что это была шутка?",
  "Провести час, просто глядя друг на друга в тишине, или час говорить без остановки на любые темы, но без пауз?",
  "Я случайно трогаю тебя под столом ногой и делаю вид, что ничего не было, или я делаю это нарочно и улыбаюсь, глядя тебе в глаза?",
  "Обниматься стоя в лифте, пока он едет, или сидя на скамейке в парке, где мимо ходят люди?",
  "Узнать обо мне что-то, что я никогда никому не говорил(а), но это изменит твой взгляд на меня, или узнать, что я думаю о тебе на самом деле, но без прикрас?",
  "Честный разговор о наших страхах в отношениях, но без возможности сказать «всё хорошо», или честный разговор о том, что нас бесит друг в друге, но с правом не соглашаться?",
  "Поменяться телефонами на час, но ты знаешь, что я прочитал(а) всё, или дать друг другу право задать один самый неудобный вопрос без права отмазаться?",
  "Я говорю тебе, что мне нравится в тебе одна вещь, но не говорю какая, а ты должна угадать за 3 попытки, или я сразу показываю это действием, но без слов?",
  "Если бы я ошибся(лась) и сделал(а) тебе больно случайно — ты бы хотел(а), чтобы я извинился(лась) красиво и долго, или чтобы я просто признал(а) это и дальше делал(а) правильные выводы молча?",
  "Я целую тебя в лоб, когда ты злишься, или в плечо, когда ты смеёшься?",
  "Я случайно касаюсь твоей руки, когда мы идём рядом, и держу её дольше, чем нужно, или я беру тебя за руку нарочно, но сразу отпускаю?",
  "Когда я хочу привлечь твоё внимание, я делаю это голосом (зову по имени), или я молча кладу руку тебе на спину?",
  "Обнимать тебя сзади, когда ты стоишь у плиты, или спереди, когда ты сидишь и смотришь в телефон?",
  "Играть с твоими волосами, когда ты лежишь у меня на коленях, или гладить твою ладонь большим пальцем, когда мы держимся за руки?",
  "Однажды случайно сказать друг другу одно и то же слово в одно и то же время, или специально подгадать так, чтобы сказать «я люблю тебя» одновременно?",
  "Проснуться ночью и увидеть, что я смотрю на тебя и улыбаюсь во сне, или проснуться и обнаружить, что я тихо ушёл(ла) на кухню и готовлю тебе завтрак в 3 ночи?",
  "Однажды поссориться из-за еды (кто съел последний кусок) и смеяться над этим через час, или никогда не ссориться из-за мелочей, но не знать, что ты готов(а) уступить, если я попрошу?",
  "Назвать меня прозвищем, которое никто не знает, при людях, или называть меня по полному имени только ночью, когда мы вдвоём?",
  "Спорить со мной о чём угодно просто ради спора, даже если ты согласен(на), или всегда говорить, когда согласен(на), даже если это скучно?"
];
const thisOrThatMediumQuestions = [
  "Я случайно касаюсь твоей ноги под столом и не убираю, или я кладу руку тебе на колено, когда мы смотрим фильм, и смотрю на тебя?",
  "Ты просыпаешься и чувствуешь мой взгляд — я уже смотрю на тебя, или ты чувствуешь моё дыхание на своей шее, но я ещё сплю?",
  "Я говорю тебе шёпотом на ухо что-то, что никто не должен слышать, или я молча смотрю тебе в глаза так долго, что ты отворачиваешься первой?",
  "Я кусаю тебя за плечо, когда мы обнимаемся, или я провожу пальцами по твоей спине так медленно, что ты закрываешь глаза?",
  "Ты снимаешь мою футболку, но оставляешь свои джинсы, или я снимаю твои джинсы, но оставляю свою футболку?",
  "Провести ночь в одной кровати, но не прикасаться друг к другу (просто чувствовать тепло), или провести ночь в разных комнатах, но знать, что я думаю о тебе?",
  "Я случайно задеваю губами твою шею, когда поправляю твой воротник, или я делаю это нарочно и сразу отстраняюсь, улыбаясь?",
  "Ты хочешь, чтобы я взял(а) твою руку и положил(а) себе на грудь, когда мы лежим, или чтобы я сам(а) взял(а) твою руку и прижал(а) к своим губам?",
  "Я говорю тебе: «Я хочу тебя», глядя в глаза, или я пишу это сообщение, когда мы не рядом, и ты читаешь его ночью?",
  "Я целую тебя после ссоры — быстро и зло, или я долго молчу, а потом целую тебя медленно и нежно, как извинение?",
  "Я провожу пальцем по твоей ключице, когда мы стоим в очереди, или я кладу руку тебе на поясницу, когда мы идём, и никто этого не видит?",
  "Ты просыпаешься от того, что я глажу твои волосы, или от того, что я целую твою спину между лопатками?",
  "Когда мы целуемся, я слегка прикусываю твою нижнюю губу, или я провожу языком по твоей верхней губе, и ты понимаешь, что это не случайно?",
  "Я снимаю твою футболку, глядя тебе в глаза, или я снимаю её, уткнувшись лицом тебе в плечо, как будто мне неловко?",
  "Ты хочешь, чтобы я прижал(а) тебя к стене, когда мы целуемся, или чтобы я уложил(а) тебя на диван, но сам(а) сел(а) рядом, глядя на тебя?",
  "Я молча беру твою ладонь и кладу её себе на талию, или я сам(а) кладу руку тебе на талию, но смотрю при этом в другую сторону, как будто это случайно?",
  "Я шепчу тебе на ухо: «Ты слишком хорошо выглядишь, чтобы я мог(ла) думать о чём-то другом», или я просто молча поправляю твою одежду и улыбаюсь, не говоря ни слова?",
  "Я целую тебя в шею, когда мы обнимаемся, и оставляю след, или я целую тебя туда, где никто не увидит, но ты будешь помнить об этом весь день?",
  "Ты хочешь, чтобы я смотрел(а) на тебя, пока ты раздеваешься, или чтобы я отвернулся(лась), а потом подошёл(ла) сзади и обнял(а)?",
  "Я говорю тебе: «Не останавливайся», когда ты что-то делаешь, или я сам(а) останавливаюсь и говорю: «Я хочу тебя прямо сейчас»"
];
const thisOrThatDeepQuestions = [
  "Я медленно расстёгиваю твою рубашку, глядя тебе в глаза, или я прошу тебя сделать это самой, потому что я хочу смотреть на твои руки?",
  "Ты ловишь мой взгляд на твоих губах, когда я молчу, или ты ловишь мой взгляд ниже губ и понимаешь, о чём я думаю?",
  "Я кладу твою ладонь себе на шею и смотрю на тебя, или я кладу твою ладонь себе на живот и говорю: «Оставь её здесь»?",
  "Я целую твою шею и медленно спускаюсь к плечу, или я целую твою шею и останавливаюсь ровно там, где ты начинаешь дышать чаще?",
  "Я говорю тебе: «Раздевайся», но это звучит как просьба, или я говорю тебе: «Не раздевайся», но это звучит как приказ, который хочется нарушить?",
  "Ты хочешь, чтобы я сказал(а) тебе, что именно я хочу с тобой сделать, или чтобы я показал(а) это молча, без слов?",
  "Я снимаю свою футболку, глядя тебе в глаза, но не подхожу, или я снимаю твою футболку, и только потом снимаю свою?",
  "Я беру твою руку и кладу себе на грудь, или я беру твою руку и кладу себе на бедро, и мы оба молчим?",
  "Я целую тебя так, что у тебя перехватывает дыхание, но через минуту я отстраняюсь и говорю: «Продолжим потом», или я целую тебя и не останавливаюсь, пока ты сам(а) не отстранишься?",
  "Я говорю тебе: «Я хочу тебя больше, чем могу объяснить», глядя в глаза, или я говорю это шёпотом тебе на ухо, чтобы никто никогда не узнал?",
  "Когда мы целуемся, я притягиваю тебя за бёдра к себе, или я сам(а) подаюсь вперёд, чтобы ты почувствовал(а) меня полностью?",
  "Ты просыпаешься и чувствуешь мою руку у себя на талии, или ты просыпаешься и понимаешь, что я уже не сплю и просто смотрю на тебя?",
  "Я наклоняюсь к твоему уху и говорю: «Я думал(а) о тебе сегодня», или я молча беру твою руку и веду её туда, где ты сразу поймёшь, о чём я думал(а)?",
  "Я медленно провожу языком по твоей шее и останавливаюсь, или я делаю это и продолжаю двигаться дальше, к твоей ключице?",
  "Ты хочешь, чтобы я был(а) сверху и смотрел(а) на тебя, или чтобы я был(а) снизу и смотрел(а) на тебя так, как будто я не могу насмотреться?",
  "Я беру твои руки и завожу их тебе за голову, когда мы целуемся, или я предлагаю тебе сделать это самой, потому что мне нравится смотреть, как ты это делаешь?",
  "Я говорю тебе: «Сегодня ты будешь делать то, что я скажу», или я говорю: «Сегодня я хочу, чтобы ты делал(а) только то, что хочешь сама, а я буду подчиняться»?",
  "Я целую тебя везде, кроме губ, так долго, что ты начинаешь просить, или я целую тебя в губы сразу, но так, что ты понимаешь — это только начало?",
  "Я шепчу тебе: «Ты слишком громко дышишь», когда мы целуемся, или я молча наслаждаюсь тем, как ты дышишь, и не хочу, чтобы это заканчивалось?",
  "Я говорю тебе прямо сейчас: «Я хочу, чтобы ты был(а) только моим(ей) на одну ночь, но без обязательств», или я говорю: «Я хочу, чтобы ты был(а) моим(ей) навсегда, но начнём сегодня без лишних слов»?"
];

const thisOrThatLevels = {
  easy: {
    icon: '🌸',
    title: 'Лёгкий',
    description: 'Немного романтики, улыбок и лёгкого флирта.',
    storageKey: 'easy-progress',
    questions: thisOrThatEasyQuestions
  },
  medium: {
    icon: '💞',
    title: 'Средний',
    description: 'Более личные вопросы о чувствах, доверии и ваших отношениях.',
    storageKey: 'medium-progress',
    questions: thisOrThatMediumQuestions
  },
  deep: {
    icon: '🌙',
    title: 'Глубокий',
    description: 'Самые искренние вопросы, которые требуют доверия.',
    storageKey: 'deep-progress',
    questions: thisOrThatDeepQuestions
  }
};

const sunshineQuestions = [
'Что ты чувствуешь, когда я прикасаюсь к твоей спине случайно проходя мимо? Это просто приятно или у тебя внутри что-то переворачивается?',
'Опиши, как ты видишь наш идеальный выходной через пять лет, если у нас уже есть своё пространство, нет спешки и есть свободное время.',
'Есть ли что-то, что я делаю во сне, что тебя умиляет, смешит или даже немного раздражает?',
'Ты помнишь ту самую ситуацию, когда ты поняла, что я тебе не безразличен не как друг, а как парень? Опиши этот момент.',
'Если бы я больше никогда в жизни не сказал тебе «люблю», но показывал это действиями — тебе было бы достаточно или тебе важно слышать слова?',
'Какая самая маленькая, почти незаметная вещь может испортить тебе настроение за весь день, и какая такая же маленькая может его спасти?',
'Что ты думаешь, когда я молчу дольше обычного в переписке? Это вызывает у тебя тревогу или ты спокойно ждёшь?',
'Назови одну вещь, которую ты боишься сделать первой в отношениях, но хотела бы, чтобы я сделал её сам и снял с тебя этот груз.',
'Если бы мы встретились впервые сегодня, а не тогда — что бы ты спросила меня в первую очередь и о чём бы умолчала?',
'Какое качество во мне ты никогда не обсуждала с подругами, потому что оно слишком личное и принадлежит только тебе и мне?',
'Что ты чувствуешь, когда я провожаю тебя до двери и ухожу, а не захожу внутрь? Это разочарование, спокойствие или что-то другое?',
'Если бы ты могла оставить мне одно голосовое сообщение, которое я буду слушать в сложный день — что бы ты сказала в нём?',
'Было ли у тебя чувство, что я не договариваю что-то важное, и ты хотела бы, чтобы я открылся, но боишься спросить?',
'Что из того, что я делаю, вызывает у тебя желание сказать мне «остановись» — но не потому что плохо, а потому что слишком сильно?',
'Какое моё самое первое воспоминание о тебе, по-твоему, я запомнил навсегда? А теперь я скажу тебе своё реальное и мы сравним.',
'Если бы ты могла выбрать один день из наших отношений и прожить его заново — какой бы ты выбрала и что бы изменила, если бы могла?',
'Что тебя больше трогает: когда я говорю что-то важное глядя в глаза, или когда я пишу это ночью, когда тебя нет рядом?',
'Есть ли у тебя ощущение, что я иногда надеваю маску, даже когда мы вдвоём? Если да — в какие моменты это происходит?',
'Если бы я вдруг исчез на три дня без объяснений, что бы ты подумала в первый день, что на второй, и что бы сделала на третий?',
'Что бы ты хотела, чтобы я запомнил о тебе навсегда, если бы мы больше никогда не увиделись?'
];
let state = JSON.parse(localStorage.getItem(STORE) || '{"done":[],"memories":[]}');
state.sentenceGame ||= { index: 0, completed: false };
state.soulTalk ||= { index: 0, completed: false };
state.sunshineQuestions ||= { index: 0, completed: false };
Object.keys(thisOrThatLevels).forEach(initThisOrThatProgress);
let visitStarted = Date.now();
let timers = [];
function defaultThisOrThatProgress(){ return { index: 0, completed: false }; }
function initThisOrThatProgress(levelKey){
  const level = thisOrThatLevels[levelKey];
  const saved = JSON.parse(localStorage.getItem(level.storageKey) || 'null');
  const fallback = defaultThisOrThatProgress();
  state[level.storageKey] = { ...fallback, ...(saved || {}) };
}
function saveThisOrThatProgress(levelKey){
  const level = thisOrThatLevels[levelKey];
  localStorage.setItem(level.storageKey, JSON.stringify(state[level.storageKey]));
}
const save = () => localStorage.setItem(STORE, JSON.stringify(state));
const sentenceProgressLabel = () => state.sentenceGame.completed ? 'Готово' : `${Math.min((state.sentenceGame.index || 0) + 1, sentencePrompts.length)} / ${sentencePrompts.length}`;
const miniProgressLabel = (key, total) => state[key].completed ? 'Готово' : `${Math.min((state[key].index || 0) + 1, total)} / ${total}`;
const clearTimers = () => { timers.forEach(clearInterval); timers = []; };
const fmtDate = d => new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(d));
const fmtDay = d => new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(d));
const fmtTime = d => new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(new Date(d));

function burst(count=36, origin={x:50,y:78}){
  const fragment = document.createDocumentFragment();
  const limited = Math.min(count, 90);
  for(let i=0;i<limited;i++){
    const e=document.createElement('span');
    const isHeart=Math.random()>.28;
    e.className=`burst ${isHeart?'heartConfetti':'sparkConfetti'}`;
    e.textContent=isHeart?'❤️':'✦';
    const angle=(-115+Math.random()*230)*Math.PI/180;
    const distance=90+Math.random()*260;
    const fall=110+Math.random()*220;
    e.style.cssText=`--x:${origin.x+(Math.random()-.5)*10}vw;--y:${origin.y+(Math.random()-.5)*8}vh;--tx:${Math.cos(angle)*distance}px;--ty:${Math.sin(angle)*distance+fall}px;--rot:${(Math.random()-.5)*720}deg;--d:${2.8+Math.random()*2.4}s;--s:${12+Math.random()*18}px;--o:${.45+Math.random()*.5}`;
    fragment.append(e);
    setTimeout(()=>e.remove(),6200);
  }
  document.body.append(fragment);
}
function sparkles(count=22, area=document.body){
  count = Math.min(count, matchMedia('(max-width: 760px)').matches ? 22 : 34);
  const fragment = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const e=document.createElement('span');
    e.className='twinkle';
    e.style.cssText=`--x:${Math.random()*100}vw;--y:${Math.random()*100}vh;--d:${1.7+Math.random()*2.2}s;--delay:${Math.random()*1.2}s;--s:${3+Math.random()*5}px`;
    fragment.append(e);
    setTimeout(()=>e.remove(),5200);
  }
  area.append(fragment);
}

function floatingHearts(count=34){
  const fragment = document.createDocumentFragment();
  const total = Math.min(count, matchMedia('(max-width: 760px)').matches ? 28 : 46);
  for(let i=0;i<total;i++){
    const e=document.createElement('span');
    e.className='floatingHeart';
    e.textContent='❤️';
    e.style.cssText=`--x:${Math.random()*100}vw;--drift:${(Math.random()-.5)*46}vw;--s:${12+Math.random()*22}px;--o:${.28+Math.random()*.52};--r:${(Math.random()-.5)*70}deg;--d:${5.8+Math.random()*5.6}s;--delay:${Math.random()*1.6}s`;
    fragment.append(e);
    setTimeout(()=>e.remove(),13000);
  }
  document.body.append(fragment);
}
function screen(html){ clearTimers(); app.innerHTML = `<section class="screen">${html}</section>`; }
function intro(){ screen(`<div class="center"><div class="glass hero"><div class="kicker">маленький секрет</div><h1 class="title">Считаешь ли ты себя красивой? ❤️</h1><p class="subtitle">Ответь честно, моя самая нежная звёздочка.</p><div class="actions"><button class="btn" id="yes">❤️ Да</button><button class="btn secondary" id="no">🙈 Нет</button></div></div></div>`); document.querySelector('#yes').onclick=yesIntro; const no=document.querySelector('#no'); const move=()=>{ const r=no.getBoundingClientRect(), m=20; no.classList.add('runaway'); no.style.left=m+Math.random()*(innerWidth-r.width-m*2)+'px'; no.style.top=m+Math.random()*(innerHeight-r.height-m*2)+'px'; }; ['pointerenter','pointerdown','touchstart','click'].forEach(ev=>no.addEventListener(ev,e=>{e.preventDefault();move();})); }
function yesIntro() {
    document.body.insertAdjacentHTML('beforeend', '<div class="dark"></div>');

    floatingHearts(42);
    sparkles(28);

    screen(`
        <div class="center">
            <div class="glass hero">
                <h1 class="title">💖 Золотце моё любимое ❤️</h1>
                <button class="btn" id="continue">Продолжить ❤️</button>
            </div>
        </div>
    `);

    document.querySelector('#continue').onclick = menu;

    setTimeout(() => document.querySelector('.dark')?.remove(), 1400);
}
function menu(){ const done=state.done.length; const greet=greetings[Math.floor(Math.random()*greetings.length)]; screen(`<div class="menuHead"><div><div class="kicker">${greet}</div><h1>Наш маленький мир</h1></div><button class="btn secondary" onclick="intro()">В начало</button></div><div class="grid"><article class="glass card" onclick="game()"><h2>❤️ Сердце любви</h2><p class="small">Главная магия для нас двоих.</p><div class="metric">${done} / 50 ❤️</div><p>Выполнено</p></article><article class="glass card" onclick="completedChallenges()"><h2>❤️ Пройденные испытания</h2><p class="small">История выполненных заданий с датой и временем.</p><div class="metric">${state.memories.length}</div></article><article class="glass card" onclick="memories()"><h2>📷 Наши воспоминания</h2><p class="small">Тёплое место для будущих фото, видео и общих моментов.</p><div class="metric">♡</div></article><article class="glass card" onclick="stripDurak()"><h2>🃏 Дурак на раздевание</h2><p class="small">Место для будущей онлайн-игры.</p><div class="metric">🃏❤️</div></article><article class="glass card" onclick="sentenceIntro()"><h2>💌 Незаконченные предложения</h2><p class="small">Романтичная игра для честных фраз по очереди.</p><div class="metric">${sentenceProgressLabel()}</div></article><article class="glass card" onclick="soulTalkIntro()"><h2>💞 Разговоры по душам</h2><p class="small">15 вопросов только для нас ❤️</p><div class="metric">${miniProgressLabel('soulTalk', soulTalkQuestions.length)}</div></article><article class="glass card" onclick="sunshineIntro()"><h2>🌹 Вопросы для любимого солнышка</h2><p class="small">20 личных вопросов ❤️</p><div class="metric">${miniProgressLabel('sunshineQuestions', sunshineQuestions.length)}</div></article><article class="glass card" onclick="thisOrThatIntro()"><h2>❤️ Это или то</h2><p class="small">Выбирай сердцем ❤️</p><div class="metric">${thisOrThatMenuMetric()}</div></article><article class="glass card"><h2>⏳ Мы вместе</h2><div class="timer" id="loveTimer"></div></article><article class="glass card"><h2>⏱ Время на сайте</h2><p>Ты уже здесь</p><div class="metric" id="siteTimer">0 минут 0 секунд</div></article><article class="glass card" onclick="achievements()"><h2>🏆 Наши достижения</h2><p class="small">Нежные награды открываются по мере приключения.</p><div class="metric">${unlocked().length} / 7</div></article></div>`); tickTimers(); const id=setInterval(tickTimers,1000); timers.push(id); }
function relationshipParts(start, end=new Date()){
  let y=end.getFullYear()-start.getFullYear(), mo=end.getMonth()-start.getMonth(), d=end.getDate()-start.getDate(), h=end.getHours()-start.getHours(), mi=end.getMinutes()-start.getMinutes(), s=end.getSeconds()-start.getSeconds();
  if(s<0){s+=60;mi--} if(mi<0){mi+=60;h--} if(h<0){h+=24;d--}
  if(d<0){ const prev=new Date(end.getFullYear(),end.getMonth(),0).getDate(); d+=prev; mo--; }
  if(mo<0){mo+=12;y--} return {y,mo,d,h,mi,s};
}
function sessionParts(){ let s=Math.floor((Date.now()-visitStarted)/1000); const mi=Math.floor(s/60); s-=mi*60; return {mi,s}; }
function tickTimers(){ const loveEl=document.querySelector('#loveTimer'); const siteEl=document.querySelector('#siteTimer'); const l=relationshipParts(new Date(START_DATE)); if(loveEl) loveEl.innerHTML=[['Лет',l.y],['Месяцев',l.mo],['Дней',l.d],['Часов',l.h],['Минут',l.mi],['Секунд',l.s]].map(x=>`<div class="pill"><b>${x[1]}</b>${x[0]}</div>`).join(''); const v=sessionParts(); if(siteEl) siteEl.textContent=`${v.mi} минут ${v.s} секунд`; }
function game(){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="heartWrap"><div class="heartStage"><button class="magicHeart" id="heart" aria-label="Открыть испытание"><span class="heartAura"></span><svg viewBox="0 0 512 512" aria-hidden="true"><defs><linearGradient id="heartGradient" x1="20%" y1="8%" x2="86%" y2="92%"><stop offset="0%" stop-color="#fff6fb"/><stop offset="22%" stop-color="#ff98c8"/><stop offset="58%" stop-color="#ff3f93"/><stop offset="100%" stop-color="#d81a72"/></linearGradient><radialGradient id="heartShine" cx="31%" cy="24%" r="38%"><stop offset="0%" stop-color="rgba(255,255,255,.95)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><path class="heartShape" d="M256 462C126 347 48 278 48 172 48 91 112 40 181 40c39 0 76 18 99 49 23-31 60-49 99-49 69 0 133 51 133 132 0 106-78 175-208 290l-48 42-48-42Z"/><path class="heartHighlight" d="M160 88c-46 10-76 45-76 91 0 23 7 43 20 63 18-86 76-122 145-113-20-30-53-49-89-41Z"/></svg><span class="heartReflection"></span></button><div class="orbit" aria-hidden="true"><i></i><i></i><i></i></div><h1>Нажми на сердце любви</h1><p class="small">Оно выберет случайное испытание, которое ещё не было выполнено.</p><div class="gameProgress">Пройдено: ${state.done.length} / 50 ❤️</div></div></div>`); document.querySelector('#heart').onclick=pick; }
function pick(){ const left=challenges.map((_,i)=>i).filter(i=>!state.done.includes(i)); if(!left.length) return completeAll(); const heartEl=document.querySelector('#heart'); heartEl.classList.add('activated'); burst(54,{x:50,y:45}); sparkles(28); setTimeout(()=>showChallenge(left[Math.floor(Math.random()*left.length)]),1250); }
function showChallenge(i){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass challenge"><div class="kicker">испытание ${i+1}</div><p>${challenges[i]}</p><div class="actions"><button class="btn" id="done">Выполнено ❤️</button><button class="btn secondary" onclick="game()">Выбрать позже</button></div></div></div>`); done.onclick=()=>complete(i); }
function complete(i){
  if(!state.done.includes(i)){
    state.done.push(i);
    state.memories.unshift({text:challenges[i],date:new Date().toISOString(),number:i+1});
    save();
  }
  document.body.insertAdjacentHTML('beforeend','<div class="dark"></div>');
  burst(64);
  sparkles(24);
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass hero completionCard"><h1>✨ Поздравляю!</h1><p class="subtitle">❤️ Еще одно воспоминание создано.</p><div class="kicker">Пройдено:</div><div class="metric">${state.done.length} / 50</div><button class="btn nextChallenge" onclick="game()">Открыть следующее испытание ❤️</button></div></div>`);
  setTimeout(()=>document.querySelector('.dark')?.remove(),900);
}
function completedChallenges(){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="glass hero historyPanel"><h1>❤️ Пройденные испытания</h1><p class="small">Здесь хранится история нашего прогресса.</p><div class="list">${state.memories.length?state.memories.map(m=>`<div class="memory"><b>✅ Испытание №${m.number}</b><p>${m.text}</p><div class="historyMeta"><span>📅 ${fmtDay(m.date)}</span><span>🕒 ${fmtTime(m.date)}</span></div></div>`).join(''):'<p class="small">Пока нет пройденных испытаний. Нажми на сердце любви, чтобы создать первое.</p>'}</div></div>`); }
const PHOTO_MANIFEST = 'assets/photos/manifest.json';
let galleryPhotos = [];
let galleryIndex = 0;
let galleryTouchStartX = 0;
const escapeAttr = value => String(value).replace(/[&"<>]/g, char => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[char]));
const photoTitle = src => decodeURIComponent(src.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
function normalizePhotoList(photos){
  return [...new Set(photos)]
    .filter(src => /\.(jpe?g|png|webp)$/i.test(src))
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' }));
}
async function loadGalleryPhotos(){
  const cacheKey = `v=${Date.now()}`;
  try {
    const response = await fetch(`${PHOTO_MANIFEST}?${cacheKey}`, { cache: 'no-store' });
    if(response.ok){
      const photos = normalizePhotoList(await response.json());
      if(photos.length) return photos;
    }
  } catch {}

  try {
    const response = await fetch(`assets/photos/?${cacheKey}`, { cache: 'no-store' });
    if(!response.ok) return [];
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return normalizePhotoList([...doc.querySelectorAll('a')].map(link => `assets/photos/${link.getAttribute('href') || ''}`));
  } catch {
    return [];
  }
}
function renderMemoriesGallery(photos){
  const target = document.querySelector('#photoGallery');
  if(!target) return;
  galleryPhotos = photos;
  if(!photos.length){
    target.innerHTML = `<div class="emptyMemory photoEmpty"><div class="tinyPulse big">❤️</div><p>❤️ Здесь совсем скоро появятся наши самые тёплые воспоминания.</p></div>`;
    return;
  }
  target.innerHTML = `<div class="photoGrid">${photos.map((src, index) => `<button class="photoFrame" onclick="openPhotoViewer(${index})" aria-label="Открыть фото ${index + 1}"><img src="${escapeAttr(src)}" alt="${escapeAttr(photoTitle(src))}" loading="lazy"><span>❤️</span></button>`).join('')}</div>`;
  sparkles(12, target);
}
async function memories(){
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="glass hero historyPanel memoriesPanel"><h1>❤️ Наши воспоминания</h1><p class="small">Романтичный альбом для самых тёплых моментов, которые хочется пересматривать снова и снова.</p><div id="photoGallery"><div class="emptyMemory"><div class="tinyPulse">❤️</div><p>Загружаю наши воспоминания...</p></div></div></div>`);
  renderMemoriesGallery(await loadGalleryPhotos());
}
function openPhotoViewer(index){
  if(!galleryPhotos.length) return;
  galleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  closePhotoViewer();
  document.body.insertAdjacentHTML('beforeend', `<div class="photoViewer" id="photoViewer" role="dialog" aria-modal="true" aria-label="Просмотр воспоминания"><button class="viewerClose" onclick="closePhotoViewer()" aria-label="Закрыть">×</button><button class="viewerNav viewerPrev" onclick="showPhoto(-1)" aria-label="Предыдущее фото">‹</button><img id="viewerImage" src="${escapeAttr(galleryPhotos[galleryIndex])}" alt="${escapeAttr(photoTitle(galleryPhotos[galleryIndex]))}"><button class="viewerNav viewerNext" onclick="showPhoto(1)" aria-label="Следующее фото">›</button><div class="viewerCount" id="viewerCount"></div></div>`);
  updatePhotoViewer();
  document.addEventListener('keydown', photoViewerKeys);
  const viewer = document.querySelector('#photoViewer');
  viewer.addEventListener('touchstart', e => galleryTouchStartX = e.touches[0].clientX, { passive: true });
  viewer.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - galleryTouchStartX;
    if(Math.abs(diff) > 42) showPhoto(diff > 0 ? -1 : 1);
  }, { passive: true });
}
function updatePhotoViewer(){
  const image = document.querySelector('#viewerImage');
  const count = document.querySelector('#viewerCount');
  if(!image || !count) return;
  image.classList.remove('viewerZoom');
  void image.offsetWidth;
  image.src = galleryPhotos[galleryIndex];
  image.alt = photoTitle(galleryPhotos[galleryIndex]);
  image.classList.add('viewerZoom');
  count.textContent = `${galleryIndex + 1} / ${galleryPhotos.length} ❤️`;
}
function showPhoto(direction){
  if(!galleryPhotos.length) return;
  galleryIndex = (galleryIndex + direction + galleryPhotos.length) % galleryPhotos.length;
  updatePhotoViewer();
}
function photoViewerKeys(event){
  if(event.key === 'Escape') closePhotoViewer();
  if(event.key === 'ArrowLeft') showPhoto(-1);
  if(event.key === 'ArrowRight') showPhoto(1);
}
function closePhotoViewer(){
  document.querySelector('#photoViewer')?.remove();
  document.removeEventListener('keydown', photoViewerKeys);
}

function stripDurak(){ screen(`<div class="center"><div class="glass hero placeholderPage"><div class="placeholderIcon">🃏❤️</div><h1>Дурак на раздевание</h1><p class="subtitle">Пока рано. ❤️</p><div class="tinyPulse">❤️</div><button class="btn backHome" onclick="menu()">← Вернуться назад</button></div></div>`); }
function sentenceIntro(){
  if(state.sentenceGame.completed) return sentenceComplete(false);
  screen(`<div class="center"><div class="glass hero sentenceIntro"><h1>💌 Незаконченные предложения</h1><p class="subtitle">Мы будем по очереди заканчивать предложения.<br><br>Здесь нет правильных ответов.<br><br>Только честность, искренность и немного смелости. ❤️</p><button class="btn backHome" onclick="sentenceGame()">✨ Начать</button><button class="btn secondary" onclick="menu()">← Вернуться назад</button></div></div>`);
}
function sentenceGame(){
  if(state.sentenceGame.completed) return sentenceComplete(false);
  const index = Math.min(state.sentenceGame.index || 0, sentencePrompts.length - 1);
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass sentenceCard" id="sentenceCard"><p>${sentencePrompts[index]}</p><div class="sentenceProgress">${index + 1} / ${sentencePrompts.length}</div><button class="btn" onclick="nextSentence()">Следующее предложение ❤️</button></div></div>`);
}
function nextSentence(){
  const card=document.querySelector('#sentenceCard');
  card?.classList.add('sentenceFlip');
  setTimeout(()=>{
    const next=(state.sentenceGame.index || 0) + 1;
    if(next >= sentencePrompts.length){
      state.sentenceGame = { index: sentencePrompts.length, completed: true };
      save();
      sentenceComplete(true);
      return;
    }
    state.sentenceGame.index = next;
    save();
    sentenceGame();
  }, 360);
}
function sentenceComplete(withEffects=true){
  if(withEffects){ burst(70); sparkles(26); }
  screen(`<div class="center"><div class="glass hero sentenceDone"><div class="tinyPulse big">❤️</div><h1>✨ Поздравляю!</h1><p class="subtitle">❤️ Вы закончили все предложения.<br><br>Иногда самые важные разговоры начинаются именно с таких маленьких фраз.</p><button class="btn backHome" onclick="menu()">← Вернуться в главное меню</button></div></div>`);
}

const questionGames = {
  soulTalk: {
    title: '💞 Разговоры по душам',
    description: 'Иногда самые важные разговоры начинаются с одного простого вопроса.<br><br>Здесь нет правильных ответов.<br><br>Есть только мы, честность и время, проведённое вместе. ❤️',
    start: '✨ Начать разговор',
    next: 'Следующий вопрос ❤️',
    doneTitle: '✨ Разговор окончен',
    doneText: '❤️ Надеюсь, теперь мы стали понимать друг друга ещё немного лучше.',
    questions: soulTalkQuestions
  },
  sunshineQuestions: {
    title: '🌹 Вопросы для любимого солнышка',
    description: 'Иногда хочется узнать не что-то новое.<br><br>Иногда хочется узнать что-то глубже.<br><br>Отвечай так, как чувствуешь. ❤️',
    start: '✨ Начать',
    next: '❤️ Следующий вопрос',
    doneTitle: '✨ Спасибо за искренность',
    doneText: '❤️ Теперь я знаю тебя ещё немного лучше.',
    questions: sunshineQuestions
  }
};
function questionIntro(key){
  const game = questionGames[key];
  if(state[key].completed) return questionComplete(key, false);
  floatingHearts(14);
  sparkles(12);
  screen(`<div class="center"><div class="glass hero questionIntro"><h1>${game.title}</h1><p class="subtitle">${game.description}</p><button class="btn backHome" onclick="questionGame('${key}')">${game.start}</button><button class="btn secondary" onclick="menu()">← Вернуться назад</button></div></div>`);
}
function questionGame(key){
  const game = questionGames[key];
  if(state[key].completed) return questionComplete(key, false);
  const index = Math.min(state[key].index || 0, game.questions.length - 1);
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass sentenceCard questionCard" id="questionCard"><p>${game.questions[index]}</p><div class="sentenceProgress">${index + 1} / ${game.questions.length} ❤️</div><button class="btn" onclick="nextQuestion('${key}')">${game.next}</button></div></div>`);
}
function nextQuestion(key){
  const card=document.querySelector('#questionCard');
  card?.classList.add('sentenceFlip');
  setTimeout(()=>{
    const game = questionGames[key];
    const next=(state[key].index || 0) + 1;
    if(next >= game.questions.length){
      state[key] = { index: game.questions.length, completed: true };
      save();
      questionComplete(key, true);
      return;
    }
    state[key].index = next;
    save();
    questionGame(key);
  }, 360);
}
function questionComplete(key, withEffects=true){
  const game = questionGames[key];
  if(withEffects){ document.body.insertAdjacentHTML('beforeend','<div class="dark"></div>'); burst(82); sparkles(30); floatingHearts(24); setTimeout(()=>document.querySelector('.dark')?.remove(),1000); }
  screen(`<div class="center"><div class="glass hero sentenceDone questionDone"><div class="tinyPulse big">❤️</div><h1>${game.doneTitle}</h1><p class="subtitle">${game.doneText}</p><button class="btn backHome" onclick="menu()">← Вернуться в главное меню</button></div></div>`);
}
function soulTalkIntro(){ questionIntro('soulTalk'); }
function sunshineIntro(){ questionIntro('sunshineQuestions'); }

function thisOrThatMenuMetric(){
  const total = Object.keys(thisOrThatLevels).length;
  const done = Object.values(thisOrThatLevels).filter(level => state[level.storageKey]?.completed).length;
  return `${done} / ${total}`;
}
function thisOrThatProgressLabel(levelKey){
  const level = thisOrThatLevels[levelKey];
  const progress = state[level.storageKey] || defaultThisOrThatProgress();
  const total = level.questions.length;
  if(progress.completed) return 'Готово ❤️';
  return `${Math.min((progress.index || 0) + 1, Math.max(total, 1))} / ${total} ❤️`;
}
function thisOrThatIntro(){
  floatingHearts(16);
  sparkles(14);
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="thisOrThatShell"><div class="menuHead"><div><div class="kicker">романтичная мини-игра</div><h1>❤️ Это или то</h1><p class="subtitle">Выбирай сердцем ❤️</p></div></div><div class="levelGrid">${Object.entries(thisOrThatLevels).map(([key, level]) => `<article class="glass levelCard"><div class="levelIcon">${level.icon}</div><h2>${level.title}</h2><p class="small">${level.description}</p><div class="gameProgress">${thisOrThatProgressLabel(key)}</div><button class="btn" onclick="selectThisOrThatLevel('${key}')">✨ Начать</button></article>`).join('')}</div></div>`);
}
function selectThisOrThatLevel(levelKey){
  if(levelKey === 'deep') return deepLevelConfirm();
  startThisOrThatLevel(levelKey);
}
function deepLevelConfirm(){
  screen(`<button class="btn secondary back" onclick="thisOrThatIntro()">← Назад</button><div class="center"><div class="glass hero confirmDialog"><h1>🌙 Глубокий уровень</h1><p class="subtitle">Некоторые вопросы здесь более личные.<br><br>Продолжайте только если вам обоим комфортно отвечать честно. ❤️</p><div class="actions"><button class="btn" onclick="startThisOrThatLevel('deep')">❤️ Да, продолжить</button><button class="btn secondary" onclick="thisOrThatIntro()">← Назад</button></div></div></div>`);
}
function startThisOrThatLevel(levelKey){
  const level = thisOrThatLevels[levelKey];
  const progress = state[level.storageKey];
  if(progress.completed) return thisOrThatComplete(levelKey, false);
  if(!level.questions.length) return thisOrThatEmpty(levelKey);
  thisOrThatGame(levelKey);
}
function thisOrThatEmpty(levelKey){
  const level = thisOrThatLevels[levelKey];
  screen(`<button class="btn secondary back" onclick="thisOrThatIntro()">← Назад</button><div class="center"><div class="glass hero questionIntro"><h1>${level.icon} ${level.title}</h1><p class="subtitle">Вопросы для этого уровня пока не добавлены.<br><br>Заполните соответствующий массив, и прогресс автоматически будет считаться по его длине. ❤️</p><button class="btn" onclick="thisOrThatIntro()">← Вернуться к выбору уровней</button></div></div>`);
}
function thisOrThatGame(levelKey){
  const level = thisOrThatLevels[levelKey];
  const progress = state[level.storageKey];
  if(progress.completed) return thisOrThatComplete(levelKey, false);
  const index = Math.min(progress.index || 0, level.questions.length - 1);
  screen(`<button class="btn secondary back" onclick="thisOrThatIntro()">← Назад</button><div class="center"><div class="glass thisOrThatQuestion" id="thisOrThatQuestion"><div class="kicker">${level.icon} ${level.title}</div><p>${level.questions[index]}</p><div class="sentenceProgress">${index + 1} / ${level.questions.length} ❤️</div><button class="btn" onclick="nextThisOrThatQuestion('${levelKey}')">❤️ Следующий вопрос</button></div></div>`);
}
function nextThisOrThatQuestion(levelKey){
  const card = document.querySelector('#thisOrThatQuestion');
  card?.classList.add('thisOrThatFlip');
  setTimeout(() => {
    const level = thisOrThatLevels[levelKey];
    const progress = state[level.storageKey];
    const next = (progress.index || 0) + 1;
    if(next >= level.questions.length){
      state[level.storageKey] = { index: level.questions.length, completed: true };
      saveThisOrThatProgress(levelKey);
      thisOrThatComplete(levelKey, true);
      return;
    }
    progress.index = next;
    saveThisOrThatProgress(levelKey);
    thisOrThatGame(levelKey);
  }, 390);
}
function thisOrThatComplete(levelKey, withEffects = true){
  if(withEffects){ document.body.insertAdjacentHTML('beforeend','<div class="dark"></div>'); burst(88); sparkles(34); floatingHearts(30); setTimeout(()=>document.querySelector('.dark')?.remove(),1000); }
  const level = thisOrThatLevels[levelKey];
  screen(`<div class="center"><div class="glass hero sentenceDone thisOrThatDone"><div class="tinyPulse big">❤️</div><h1>✨ Поздравляю!</h1><p class="subtitle">❤️ Вы прошли этот уровень.<br><br>Спасибо за честность и время, проведённое вместе.</p><div class="gameProgress">${level.icon} ${level.title}</div><button class="btn backHome" onclick="thisOrThatIntro()">← Вернуться к выбору уровней</button></div></div>`);
}

function unlocked(){ const d=state.done.length; return [['❤️ Первый шаг',d>=0],['❤️ Первое испытание',d>=1],['❤️ Уже 10 испытаний',d>=10],['❤️ Половина пути',d>=25],['❤️ Осталось совсем немного',d>=45],['❤️ Все испытания завершены',d>=50],['❤️ Самая красивая девушка',true]].filter(a=>a[1]).map(a=>a[0]); }
function achievements(){ const d=state.done.length; const all=[['❤️ Первый шаг',d>=0],['❤️ Первое испытание',d>=1],['❤️ Уже 10 испытаний',d>=10],['❤️ Половина пути',d>=25],['❤️ Осталось совсем немного',d>=45],['❤️ Все испытания завершены',d>=50],['❤️ Самая красивая девушка',true]]; screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="glass hero" style="width:min(720px,100%)"><h1>🏆 Наши достижения</h1><div class="list">${all.map(a=>`<div class="ach ${a[1]?'':'locked'}">${a[1]?'✨':'🔒'} ${a[0]}</div>`).join('')}</div></div>`); }
function completeAll(){ screen(`<div class="center"><div class="glass hero"><h1>❤️ Всё пройдено</h1><p class="subtitle">Все 50 воспоминаний уже созданы. Это только начало нашей истории.</p><button class="btn" onclick="menu()">Вернуться в наш мир</button></div></div>`); }
window.intro=intro; window.menu=menu; window.game=game; window.memories=memories; window.openPhotoViewer=openPhotoViewer; window.closePhotoViewer=closePhotoViewer; window.showPhoto=showPhoto; window.completedChallenges=completedChallenges; window.stripDurak=stripDurak; window.sentenceIntro=sentenceIntro; window.sentenceGame=sentenceGame; window.nextSentence=nextSentence; window.thisOrThatIntro=thisOrThatIntro; window.selectThisOrThatLevel=selectThisOrThatLevel; window.startThisOrThatLevel=startThisOrThatLevel; window.nextThisOrThatQuestion=nextThisOrThatQuestion; window.soulTalkIntro=soulTalkIntro; window.sunshineIntro=sunshineIntro; window.questionGame=questionGame; window.nextQuestion=nextQuestion; window.achievements=achievements; intro();
