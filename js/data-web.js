/* =========================================================
   data-web.js — Web Development Academy curriculum
   Progression is strictly linear across chapters:
   HTML Beg -> CSS Beg -> JS Beg -> HTML Int -> CSS Int ->
   JS Int -> HTML Exp -> CSS Exp -> JS Exp
   ========================================================= */

const WEB_ACADEMY = {
  id: 'web',
  name: 'Web Development Academy',
  tagline: 'Forge the front lines of the internet — HTML, CSS & JavaScript.',
  chapters: [

  /* ============================= 1. HTML BEGINNER ============================= */
  {
    id: 'html-beg', subject:'HTML', tier:'Beginner', title:'HTML Beginner — The First Signal',
    summary:'Structure your first page: tags, text, links, images and lists.',
    lessons: [
      {
        id:'html-beg-1', title:'Document Structure & Text',
        explanation:'Every HTML page starts with the same skeleton: <!DOCTYPE html>, an <html> root, a <head> for metadata (like <title> and <meta>), and a <body> for visible content. Headings (<h1>–<h6>) and paragraphs (<p>) give your text shape and hierarchy.',
        syntax:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Page Title</title>
  </head>
  <body>
    <h1>Main Heading</h1>
    <p>A paragraph of text.</p>
  </body>
</html>`,
        mistakes:[
          '<b>Forgetting &lt;!DOCTYPE html&gt;</b> — browsers fall back to a quirks-mode that breaks layout.',
          '<b>Using multiple &lt;h1&gt; tags</b> carelessly — one clear top-level heading per page is best for structure and SEO.',
          '<b>Nesting a block tag inside a &lt;p&gt;</b> (like a &lt;div&gt;) — paragraphs should only hold inline/text content.'
        ],
        editorType:'html',
        files:{ html:`<h1>Welcome, Cadet</h1>\n<p>Edit this text and watch the preview update.</p>` },
        quiz:[
          { q:'Which tag holds page metadata like <title>?', options:['<body>','<head>','<meta>','<html>'], answer:1 },
          { q:'What is the correct tag for the single most important heading?', options:['<h6>','<head>','<h1>','<title>'], answer:2 }
        ],
        quest:{
          title:'Signal Beacon', description:'Create an <h1> that says "Cadet Log" and a <p> with any sentence about your mission.',
          starter:`<!-- write your h1 and p below -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const h1 = doc.querySelector('h1');
            const p = doc.querySelector('p');
            if(!h1) return {pass:false,message:'Add an <h1> tag.'};
            if(!/cadet log/i.test(h1.textContent)) return {pass:false,message:'Your <h1> should say "Cadet Log".'};
            if(!p || !p.textContent.trim()) return {pass:false,message:'Add a <p> with a sentence inside it.'};
            return {pass:true,message:'Transmission received — beacon online!'};
          }
        }
      },
      {
        id:'html-beg-2', title:'Links, Images & Lists',
        explanation:'The <a> tag links to other pages using href. The <img> tag embeds images with src and alt (always describe the image — it helps accessibility and SEO). Lists group items with <ul> (unordered) or <ol> (ordered), each item wrapped in <li>.',
        syntax:`<a href="https://example.com">Visit Example</a>
<img src="ship.png" alt="A small starship">
<ul>
  <li>Fuel cell</li>
  <li>Star map</li>
</ul>`,
        mistakes:[
          '<b>Missing the alt attribute</b> on &lt;img&gt; — screen readers and broken-image fallbacks depend on it.',
          '<b>Forgetting quotes</b> around attribute values like href or src.',
          '<b>Putting &lt;li&gt; items outside a &lt;ul&gt;/&lt;ol&gt;</b> — list items must be direct children of a list container.'
        ],
        editorType:'html',
        files:{ html:`<a href="#">Star Chart</a>\n<ul>\n  <li>Item one</li>\n</ul>` },
        quiz:[
          { q:'Which attribute provides fallback/accessible text for an image?', options:['title','alt','src','href'], answer:1 },
          { q:'Which tag creates a numbered list?', options:['<ul>','<list>','<ol>','<li>'], answer:2 }
        ],
        quest:{
          title:'Cargo Manifest', description:'Build an unordered list <ul> with at least 3 <li> supply items, and one <a> link with href="#".',
          starter:`<!-- build your manifest here -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const items = doc.querySelectorAll('ul li');
            const link = doc.querySelector('a[href]');
            if(items.length < 3) return {pass:false,message:'You need at least 3 <li> items inside a <ul>.'};
            if(!link) return {pass:false,message:'Add an <a href="#"> link.'};
            return {pass:true,message:'Manifest logged. Supplies secured.'};
          }
        }
      },
      {
        id:'html-beg-3', title:'Div, Span, Semantic Tags & Formatting',
        explanation:'<div> is a generic block container, <span> a generic inline container — useful for styling hooks. Semantic tags like <header>, <nav>, <main>, <section>, <footer> describe *meaning*, which helps browsers, search engines and assistive tech. Text formatting tags include <strong> (importance), <em> (emphasis), <br> (line break).',
        syntax:`<header>
  <nav>Menu</nav>
</header>
<main>
  <section>
    <p>This is <strong>important</strong> and this is <em>emphasized</em>.</p>
  </section>
</main>`,
        mistakes:[
          '<b>Using &lt;div&gt; for everything</b> — prefer a semantic tag when one fits (nav, header, footer, article).',
          '<b>Confusing &lt;b&gt;/&lt;i&gt; with &lt;strong&gt;/&lt;em&gt;</b> — the latter carry real semantic meaning, not just visual style.',
          '<b>Self-closing &lt;div&gt;</b> — div and span always need a closing tag.'
        ],
        editorType:'html',
        files:{ html:`<div>\n  <span>inline text</span>\n</div>` },
        quiz:[
          { q:'Which tag is a generic INLINE container?', options:['<div>','<section>','<span>','<p>'], answer:2 },
          { q:'Which tag best marks up a page\'s primary navigation?', options:['<div class="nav">','<nav>','<header>','<menu>'], answer:1 }
        ],
        quest:{
          title:'Command Deck Layout', description:'Structure a page with a <header>, a <main> containing at least one <section>, and a <footer>.',
          starter:`<!-- lay out header / main>section / footer -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const ok = doc.querySelector('header') && doc.querySelector('main section') && doc.querySelector('footer');
            return ok ? {pass:true,message:'Command deck assembled.'} : {pass:false,message:'You need a <header>, a <section> inside <main>, and a <footer>.'};
          }
        }
      }
    ],
    boss:{
      id:'html-beg-boss', title:'Boss: The Bio Page', flavor:'A rogue portfolio bot demands a proper personal page before it lets you pass.',
      description:'Build a personal bio page containing: one <h1> with your name, a <p> bio, an <img> with alt text, a <ul> of 3 skills, and a semantic <footer>.',
      editorType:'html',
      files:{ html:`<!-- Assemble your full bio page -->\n` },
      validate:(files)=>{
        const doc = Validators.parseHTML(files.html);
        const checks = [
          [!!doc.querySelector('h1'), 'an <h1>'],
          [!!doc.querySelector('p'), 'a <p> bio'],
          [!!doc.querySelector('img[alt]'), 'an <img> with an alt attribute'],
          [doc.querySelectorAll('ul li').length >= 3, 'a <ul> with 3+ <li> skills'],
          [!!doc.querySelector('footer'), 'a <footer>']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Bio page online. The bot stands down.'};
      }
    }
  },

  /* ============================= 2. CSS BEGINNER ============================= */
  {
    id:'css-beg', subject:'CSS', tier:'Beginner', title:'CSS Beginner — Paint the Void',
    summary:'Selectors, colour, spacing, typography, sizing, display & hover.',
    lessons:[
      {
        id:'css-beg-1', title:'Selectors & Colours',
        explanation:'Selectors target elements to style: by tag (p), class (.card), or id (#hero). Colour can be set with keywords, hex (#4f7cff), rgb(), or hsl(). background-color paints behind an element, color paints its text.',
        syntax:`p { color: #e7e9ff; }
.card { background-color: #12173a; }
#hero { color: rgb(139,92,246); }`,
        mistakes:[
          '<b>Confusing color vs background-color</b> — color is TEXT colour only.',
          '<b>Overusing IDs for styling</b> — classes are reusable and easier to maintain; IDs should be used sparingly.',
          '<b>Missing the dot/hash</b> — .card targets class="card", #hero targets id="hero".'
        ],
        editorType:'css',
        files:{ html:`<h2 class="title">Nebula Console</h2>\n<p id="msg">Status: nominal</p>`, css:`.title { color: #6d8dff; }` },
        quiz:[
          { q:'Which selector targets class="alert"?', options:['#alert','.alert','*alert','alert{}'], answer:1 },
          { q:'Which property changes TEXT colour?', options:['background','color','fill','text-color'], answer:1 }
        ],
        quest:{
          title:'Paint the Console', description:'Give #msg a violet color (#a78bfa) and a dark background-color (#12173a).',
          starter:`#msg {\n  /* your styles */\n}`,
          validate:(files)=>{
            const css = files.css.toLowerCase();
            const hasBlock = /#msg\s*{[^}]*color\s*:\s*#a78bfa[^}]*}/.test(css) || /#msg\s*{[^}]*}/.test(css);
            const hasColor = /#msg\s*{[^}]*color\s*:\s*#a78bfa/.test(css);
            const hasBg = /#msg\s*{[^}]*background(-color)?\s*:\s*#12173a/.test(css);
            if(!hasColor) return {pass:false,message:'#msg needs color: #a78bfa;'};
            if(!hasBg) return {pass:false,message:'#msg needs background-color: #12173a;'};
            return {pass:true,message:'Console illuminated.'};
          }
        }
      },
      {
        id:'css-beg-2', title:'Spacing, Sizing & Typography',
        explanation:'The box model wraps every element in content, padding, border and margin. width/height size an element. Typography properties like font-size, font-weight and line-height control text appearance and readability.',
        syntax:`.box {
  width: 200px;
  padding: 12px;
  margin: 16px;
  border: 1px solid #2a3466;
  font-size: 1.1rem;
  line-height: 1.6;
}`,
        mistakes:[
          '<b>Mixing up padding and margin</b> — padding is INSIDE the border, margin is OUTSIDE.',
          '<b>Forgetting box-sizing: border-box</b> — without it, padding/border are added on top of your set width.',
          '<b>Using px for every font-size</b> — rem scales better with user accessibility settings.'
        ],
        editorType:'css',
        files:{ html:`<div class="box">Cargo Pod</div>`, css:`.box {\n  background:#1a2050;\n  color:#fff;\n}` },
        quiz:[
          { q:'Which is INSIDE the element\'s border?', options:['margin','padding','outline','none'], answer:1 },
          { q:'Which unit scales relative to the root font size?', options:['px','rem','vh','pt'], answer:1 }
        ],
        quest:{
          title:'Pack the Cargo Pod', description:'Give .box a padding of 20px and a margin of 10px.',
          starter:`.box {\n  background:#1a2050;\n  color:#fff;\n  /* add padding & margin */\n}`,
          validate:(files)=>{
            const css = files.css;
            const ok = /padding\s*:\s*20px/.test(css) && /margin\s*:\s*10px/.test(css);
            return ok ? {pass:true,message:'Cargo pod padded and positioned.'} : {pass:false,message:'Add padding: 20px; and margin: 10px; to .box.'};
          }
        }
      },
      {
        id:'css-beg-3', title:'Display, Positioning & Hover',
        explanation:'display controls layout mode: block, inline, inline-block, none. position (static/relative/absolute/fixed) controls how an element is placed. The :hover pseudo-class styles an element when the pointer is over it — great for interactive feedback.',
        syntax:`.btn {
  display: inline-block;
  position: relative;
}
.btn:hover {
  background: #4f7cff;
}`,
        mistakes:[
          '<b>Using position:absolute without a positioned parent</b> — it will jump relative to the whole page.',
          '<b>Forgetting display:none hides an element entirely</b> (it does not just make it invisible, unlike visibility:hidden).',
          '<b>Writing :hover with a space</b> like ".btn :hover" — that targets a *child*, not the element itself.'
        ],
        editorType:'css',
        files:{ html:`<button class="btn">Engage</button>`, css:`.btn {\n  padding:10px 18px;\n  background:#2c3f8f;\n  color:#fff;\n  border:none;\n  border-radius:8px;\n}` },
        quiz:[
          { q:'Which pseudo-class triggers when the mouse is over an element?', options:[':active',':hover',':focus',':over'], answer:1 },
          { q:'Which display value completely removes an element from layout?', options:['inline','none','block','hidden'], answer:1 }
        ],
        quest:{
          title:'Ignition Switch', description:'Add a .btn:hover rule that changes background to #4f7cff.',
          starter:`.btn:hover {\n  /* your rule */\n}`,
          validate:(files)=>{
            const ok = /\.btn:hover\s*{[^}]*background(-color)?\s*:\s*#4f7cff/i.test(files.css);
            return ok ? {pass:true,message:'Ignition primed.'} : {pass:false,message:'Add .btn:hover { background: #4f7cff; }'};
          }
        }
      }
    ],
    boss:{
      id:'css-beg-boss', title:'Boss: Style the Bio Page', flavor:'The portfolio bot returns — this time demanding style.',
      description:'Style the given card: dark background, violet-blue text colour, 16px padding, and a :hover effect that changes the border colour.',
      editorType:'css',
      files:{ html:`<div class="card">\n  <h3>Agent Profile</h3>\n  <p>Explorer-class cadet.</p>\n</div>`, css:`.card {\n  border: 2px solid #232b55;\n  /* style me */\n}` },
      validate:(files)=>{
        const css = files.css;
        const checks = [
          [/\.card\s*{[^}]*background(-color)?\s*:/i.test(css), 'a background colour on .card'],
          [/\.card\s*{[^}]*color\s*:/i.test(css), 'a text color on .card'],
          [/\.card\s*{[^}]*padding\s*:\s*16px/i.test(css), 'padding: 16px on .card'],
          [/\.card:hover\s*{[^}]*border-color\s*:/i.test(css), 'a .card:hover border-color change']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Profile card looks sharp. Bot approves.'};
      }
    }
  },

  /* ============================= 3. JAVASCRIPT BEGINNER ============================= */
  {
    id:'js-beg', subject:'JavaScript', tier:'Beginner', title:'JavaScript Beginner — Ignition',
    summary:'Variables, data types, operators, functions, conditions, loops, arrays, objects & the DOM.',
    lessons:[
      {
        id:'js-beg-1', title:'Variables & Data Types',
        explanation:'let declares a variable you can reassign; const declares one you cannot. Core primitive types are string, number, boolean, undefined, and null. JavaScript is dynamically typed — a variable\'s type is decided by its value.',
        syntax:`let energy = 100;
const shipName = "Nova";
let isDocked = true;
console.log(shipName, energy, isDocked);`,
        mistakes:[
          '<b>Using var</b> — it has confusing function-scoping; prefer let/const in modern code.',
          '<b>Reassigning a const</b> — this throws a TypeError.',
          '<b>Forgetting quotes around strings</b> — Nova (no quotes) is treated as a variable name, not text.'
        ],
        editorType:'js',
        files:{ js:`let energy = 100;\nconsole.log("Energy:", energy);` },
        quiz:[
          { q:'Which keyword creates a variable that CANNOT be reassigned?', options:['let','var','const','static'], answer:2 },
          { q:'What type is true?', options:['string','boolean','number','object'], answer:1 }
        ],
        quest:{
          title:'Power Core Readout', description:'Declare `const shipName` set to any string, and `let fuel` set to a number. console.log both.',
          starter:`// declare shipName and fuel, then log them\n`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js);
            if(r.error) return {pass:false,message:'Error: '+r.error};
            if(r.logs.length < 1) return {pass:false,message:'Use console.log to print your variables.'};
            return {pass:true,message:'Power core reading: nominal.'};
          }
        }
      },
      {
        id:'js-beg-2', title:'Operators, Conditions & Loops',
        explanation:'Arithmetic (+ - * / %), comparison (=== !== < >) and logical (&& || !) operators drive decisions. if/else branches code paths. for and while loops repeat work.',
        syntax:`for (let i = 0; i < 3; i++) {
  console.log("Scan", i);
}
if (fuel > 50) {
  console.log("Safe to launch");
} else {
  console.log("Refuel first");
}`,
        mistakes:[
          '<b>Using = instead of === </b>in a condition — = assigns, it does not compare.',
          '<b>Off-by-one loop bounds</b> — i <= length often overshoots an array by one.',
          '<b>Infinite loops</b> — forgetting to update the loop variable (i++) leaves the condition always true.'
        ],
        editorType:'js',
        files:{ js:`for (let i = 1; i <= 3; i++) {\n  console.log("Tick", i);\n}` },
        quiz:[
          { q:'Which operator checks strict equality (value AND type)?', options:['=','==','===','=>'], answer:2 },
          { q:'Which loop is best when the number of repeats is already known?', options:['while','for','if','switch'], answer:1 }
        ],
        quest:{
          title:'Diagnostic Sweep', description:'Write a for loop that logs "Sector X online" for X from 1 to 5.',
          starter:`// for loop here\n`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js);
            if(r.error) return {pass:false,message:'Error: '+r.error};
            const joined = r.logs.join(' | ');
            const ok = /1/.test(joined) && /5/.test(joined) && r.logs.length>=5;
            return ok ? {pass:true,message:'All 5 sectors report online.'} : {pass:false,message:'Log 5 lines mentioning sectors 1 through 5.'};
          }
        }
      },
      {
        id:'js-beg-3', title:'Functions, Arrays, Objects & DOM Basics',
        explanation:'Functions bundle reusable logic. Arrays store ordered lists ([1,2,3]); objects store key/value data ({name:"Nova"}). document.getElementById / querySelector reach into the page, and .textContent changes what\'s shown.',
        syntax:`function greet(name) {
  return "Hello, " + name;
}
const crew = ["Kai", "Mira"];
const ship = { name: "Nova", crew: crew.length };
document.getElementById("out").textContent = greet(ship.name);`,
        mistakes:[
          '<b>Forgetting return</b> — a function without return gives back undefined.',
          '<b>Confusing array index with length</b> — arr[arr.length] is always undefined (last valid index is length-1).',
          '<b>Using innerHTML for plain text</b> — textContent is simpler and safer when you don\'t need to insert markup.'
        ],
        editorType:'js',
        files:{
          html:`<h3 id="out">Waiting...</h3>`,
          js:`function greet(name){\n  return "Welcome aboard, " + name;\n}\ndocument.getElementById("out").textContent = greet("Cadet");`
        },
        quiz:[
          { q:'Which keyword sends a value back out of a function?', options:['break','return','send','exit'], answer:1 },
          { q:'What does document.getElementById return?', options:['A string','An array','The matching element (or null)','A number'], answer:2 }
        ],
        quest:{
          title:'First Contact Message', description:'Write a function reportStatus(name) that returns `name + " is online"`, then set #out\'s textContent to its result for "Nova".',
          starter:`// html has <h3 id="out"></h3> already\nfunction reportStatus(name) {\n\n}\n`,
          starterHtml:`<h3 id="out"></h3>`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js, {html:'<h3 id="out"></h3>'});
            if(r.error) return {pass:false,message:'Error: '+r.error};
            return {pass:true,message:'Signal function compiled. Checking DOM next lesson!'};
          }
        }
      }
    ],
    boss:{
      id:'js-beg-boss', title:'Boss: Interactive Greeting Console', flavor:'The console AI will only respond to working code.',
      description:'Using the given <input id="name"> and <button id="go">, write JS so clicking the button sets <p id="out"> to "Hello, " + the input value.',
      editorType:'js',
      files:{
        html:`<input id="name" placeholder="Enter your name">\n<button id="go">Greet</button>\n<p id="out"></p>`,
        js:`// add a click event listener on #go\n`
      },
      validate:(files)=>{
        const js = files.js;
        const checks = [
          [/getElementById\((['"])go\1\)/.test(js) || /querySelector\((['"])#go\1\)/.test(js), 'select the #go button'],
          [/addEventListener\((['"])click\1/.test(js), 'attach a "click" event listener'],
          [/name/.test(js) && /value/.test(js), 'read the #name input\'s .value'],
          [/textContent|innerText|innerHTML/.test(js), 'update #out\'s text']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Console AI responds: "Hello, Cadet." Boss defeated!'};
      }
    }
  },

  /* ============================= 4. HTML INTERMEDIATE ============================= */
  {
    id:'html-int', subject:'HTML', tier:'Intermediate', title:'HTML Intermediate — Structured Signals',
    summary:'Forms, tables, attributes, semantic HTML, accessibility & SEO basics.',
    lessons:[
      {
        id:'html-int-1', title:'Forms & Input Types',
        explanation:'<form> collects user input. <input> has many "type" values (text, email, number, checkbox, radio...). <label for="id"> ties text to a control for accessibility. <button type="submit"> sends the form.',
        syntax:`<form>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Send</button>
</form>`,
        mistakes:[
          '<b>Missing the "for" / "id" pairing</b> on label+input — screen readers can\'t connect them without it.',
          '<b>Forgetting the name attribute</b> — without it, a field\'s value won\'t be submitted with the form.',
          '<b>Using type="text" for everything</b> — type="email"/"number" give free built-in validation and better mobile keyboards.'
        ],
        editorType:'html',
        files:{ html:`<form>\n  <label for="e">Email</label>\n  <input type="text" id="e" name="e">\n</form>` },
        quiz:[
          { q:'Which attribute links a <label> to an input?', options:['name','for','id only','target'], answer:1 },
          { q:'Which input type gives built-in email format validation?', options:['type="text"','type="email"','type="string"','type="mail"'], answer:1 }
        ],
        quest:{
          title:'Recruitment Form', description:'Build a form with a labeled text input (name="callsign") and a submit button.',
          starter:`<!-- build your form -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const input = doc.querySelector('input[name="callsign"]');
            const label = doc.querySelector('label[for]');
            const submit = doc.querySelector('button[type="submit"], input[type="submit"]');
            if(!input) return {pass:false,message:'Add an <input name="callsign">.'};
            if(!label) return {pass:false,message:'Add a <label for="..."> matching the input\'s id.'};
            if(!submit) return {pass:false,message:'Add a submit button.'};
            return {pass:true,message:'Recruitment form filed.'};
          }
        }
      },
      {
        id:'html-int-2', title:'Tables & Attributes',
        explanation:'Tables display grid data: <table> > <tr> (row) > <th>/<td> (header/data cell). Attributes like colspan/rowspan merge cells. Beyond tables, attributes in general configure elements: class, id, data-*, disabled, etc.',
        syntax:`<table>
  <tr><th>Ship</th><th>Status</th></tr>
  <tr><td>Nova</td><td>Docked</td></tr>
</table>`,
        mistakes:[
          '<b>Using tables for page layout</b> — that was a 90s trick; use CSS Grid/Flexbox for layout, tables for tabular DATA only.',
          '<b>Forgetting &lt;th&gt; for headers</b> — it provides semantic meaning and default bold styling.',
          '<b>Mismatched colspan totals</b> — an incorrect colspan can silently break the grid.'
        ],
        editorType:'html',
        files:{ html:`<table>\n  <tr><td>Nova</td></tr>\n</table>` },
        quiz:[
          { q:'Which tag defines a table HEADER cell?', options:['<td>','<tr>','<th>','<head>'], answer:2 },
          { q:'Are tables appropriate for whole-page layout today?', options:['Yes, always','No — use CSS Grid/Flexbox','Only on mobile','Only with Bootstrap'], answer:1 }
        ],
        quest:{
          title:'Fleet Roster Table', description:'Build a table with a header row (Ship, Status) and 2 data rows.',
          starter:`<!-- build the roster -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const ths = doc.querySelectorAll('th').length;
            const rows = doc.querySelectorAll('tr').length;
            if(ths < 2) return {pass:false,message:'Add at least 2 <th> header cells.'};
            if(rows < 3) return {pass:false,message:'Add a header row plus 2 data rows (3 <tr> total).'};
            return {pass:true,message:'Fleet roster compiled.'};
          }
        }
      },
      {
        id:'html-int-3', title:'Semantic HTML, Accessibility & SEO Basics',
        explanation:'Semantic tags (<article>, <aside>, <figure>) describe content meaning. Accessibility (a11y) means every interactive element is reachable/labelled — use alt text, label/for, and aria-* attributes when native semantics aren\'t enough. SEO basics: one clear <title>, a <meta name="description">, and a logical heading order.',
        syntax:`<head>
  <title>Nova Fleet Log</title>
  <meta name="description" content="Mission logs from the Nova fleet.">
</head>
<article aria-label="Mission report">
  ...
</article>`,
        mistakes:[
          '<b>Skipping heading levels</b> (h1 → h4) — confuses screen-reader navigation and SEO crawlers.',
          '<b>Icon-only buttons with no label</b> — add aria-label="Close" so assistive tech announces their purpose.',
          '<b>Duplicate or missing &lt;title&gt;</b> — each page needs one unique, descriptive title.'
        ],
        editorType:'html',
        files:{ html:`<article>\n  <h2>Mission Report</h2>\n</article>` },
        quiz:[
          { q:'What does aria-label do?', options:['Adds CSS styling','Gives assistive tech an accessible name','Changes the tag type','Nothing, it\'s deprecated'], answer:1 },
          { q:'Which meta tag helps search engines summarize a page?', options:['<meta name="description">','<meta name="title">','<meta name="summary">','<title>'], answer:0 }
        ],
        quest:{
          title:'Mission Archive Entry', description:'Create a <head> with a <title> and a <meta name="description">, plus an <article> with an <h2>.',
          starter:`<!-- include head + article in your markup -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const title = doc.querySelector('title');
            const meta = doc.querySelector('meta[name="description"]');
            const article = doc.querySelector('article h2');
            const missing=[];
            if(!title||!title.textContent.trim()) missing.push('a <title>');
            if(!meta) missing.push('a <meta name="description">');
            if(!article) missing.push('an <article> with an <h2>');
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Archive entry indexed.'};
          }
        }
      }
    ],
    boss:{
      id:'html-int-boss', title:'Boss: The Contact Form Page', flavor:'A gatekeeper spirit demands an accessible, well-formed contact page.',
      description:'Build a page with: a <title>+<meta description>, an <h1>, an accessible form (labeled name & email inputs, submit button), and a semantic <footer>.',
      editorType:'html',
      files:{ html:`<!-- full contact page -->\n` },
      validate:(files)=>{
        const doc = Validators.parseHTML(files.html);
        const checks = [
          [!!doc.querySelector('title'), 'a <title>'],
          [!!doc.querySelector('meta[name="description"]'), 'a meta description'],
          [!!doc.querySelector('h1'), 'an <h1>'],
          [doc.querySelectorAll('label[for]').length >= 2, '2+ labeled inputs'],
          [!!doc.querySelector('button[type="submit"], input[type="submit"]'), 'a submit button'],
          [!!doc.querySelector('footer'), 'a <footer>']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Gatekeeper satisfied. Page approved.'};
      }
    }
  },

  /* ============================= 5. CSS INTERMEDIATE ============================= */
  {
    id:'css-int', subject:'CSS', tier:'Intermediate', title:'CSS Intermediate — Warp Layouts',
    summary:'Flexbox, Grid, transitions, transforms, animations, variables & media queries.',
    lessons:[
      {
        id:'css-int-1', title:'Flexbox',
        explanation:'display:flex turns a container into a one-dimensional layout engine. justify-content aligns items along the main axis, align-items along the cross axis, and gap adds spacing between them without margin hacks.',
        syntax:`.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}`,
        mistakes:[
          '<b>Forgetting display:flex on the PARENT</b> — flex properties do nothing without it.',
          '<b>Confusing justify-content and align-items</b> — one is main-axis, one is cross-axis (they swap with flex-direction:column).',
          '<b>Using margin instead of gap</b> for spacing between flex children — gap is simpler and avoids collapsing-margin bugs.'
        ],
        editorType:'css',
        files:{ html:`<div class="row">\n  <div class="chip">Alpha</div>\n  <div class="chip">Beta</div>\n  <div class="chip">Gamma</div>\n</div>`, css:`.chip{ background:#2c3f8f; color:#fff; padding:8px 14px; border-radius:8px; }\n.row {\n  /* make me a flex row */\n}` },
        quiz:[
          { q:'Which property aligns flex items along the CROSS axis?', options:['justify-content','align-items','flex-wrap','gap'], answer:1 },
          { q:'What must be true for justify-content to work?', options:['Child has display:flex','Parent has display:flex','Nothing special','position:absolute is set'], answer:1 }
        ],
        quest:{
          title:'Bridge Console Row', description:'Make .row a flex container with justify-content: space-between and a gap of 10px.',
          starter:`.row {\n  /* your flex rules */\n}`,
          validate:(files)=>{
            const css = files.css;
            const ok = /\.row\s*{[^}]*display\s*:\s*flex/.test(css) && /\.row\s*{[^}]*justify-content\s*:\s*space-between/.test(css) && /\.row\s*{[^}]*gap\s*:\s*10px/.test(css);
            return ok ? {pass:true,message:'Bridge console aligned.'} : {pass:false,message:'Set display:flex, justify-content:space-between and gap:10px on .row.'};
          }
        }
      },
      {
        id:'css-int-2', title:'Grid',
        explanation:'display:grid enables two-dimensional layout. grid-template-columns defines column tracks (e.g. repeat(3, 1fr)); grid-template-rows defines rows. fr units share available space proportionally.',
        syntax:`.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}`,
        mistakes:[
          '<b>Mixing up Grid and Flexbox use-cases</b> — Grid shines for 2D layouts (rows+columns together), Flexbox for 1D rows/columns.',
          '<b>Forgetting units on track sizes</b> — "1fr 1fr" not "1 1".',
          '<b>Overcomplicating with fixed pixel columns</b> — fr units make responsive resizing far easier.'
        ],
        editorType:'css',
        files:{ html:`<div class="grid">\n  <div class="tile">1</div><div class="tile">2</div><div class="tile">3</div>\n</div>`, css:`.tile{ background:#3d2f7c; color:#fff; padding:20px; text-align:center; border-radius:8px; }\n.grid {\n  /* your grid rules */\n}` },
        quiz:[
          { q:'Which value type shares space proportionally in Grid?', options:['px','%','fr','em'], answer:2 },
          { q:'grid-template-columns: repeat(3, 1fr) creates how many equal columns?', options:['1','2','3','It errors'], answer:2 }
        ],
        quest:{
          title:'Tactical Grid', description:'Make .grid a 3-column grid using repeat(3, 1fr) with a 16px gap.',
          starter:`.grid {\n  /* your grid rules */\n}`,
          validate:(files)=>{
            const css = files.css.replace(/\s+/g,' ');
            const ok = /\.grid\s*{[^}]*display\s*:\s*grid/.test(css) && /grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*1fr\s*\)/.test(css) && /gap\s*:\s*16px/.test(css);
            return ok ? {pass:true,message:'Tactical grid online.'} : {pass:false,message:'Use display:grid; grid-template-columns:repeat(3,1fr); gap:16px;'};
          }
        }
      },
      {
        id:'css-int-3', title:'Transitions, Transforms, Variables & Media Queries',
        explanation:'transition animates property changes smoothly over time. transform (scale, rotate, translate) moves/resizes without affecting layout flow. CSS variables (--name) store reusable values. @media queries apply styles conditionally, e.g. for small screens.',
        syntax:`:root { --accent: #8b5cf6; }
.card {
  transition: transform .2s ease;
}
.card:hover { transform: scale(1.04); }

@media (max-width: 600px) {
  .card { padding: 10px; }
}`,
        mistakes:[
          '<b>Animating "top/left" for movement</b> — transform:translate() is smoother/GPU-accelerated and doesn\'t trigger layout reflow.',
          '<b>Forgetting the -- prefix</b> on custom properties, or forgetting var(--x) to read them.',
          '<b>Writing max-width media queries in the wrong order</b> — later rules override earlier ones, so mobile overrides should generally come after desktop-first rules (or use mobile-first with min-width).'
        ],
        editorType:'css',
        files:{ html:`<div class="pod">Escape Pod</div>`, css:`.pod{ background:#1a2050; color:#fff; padding:16px; border-radius:10px; display:inline-block; }\n/* add transition + hover transform + a media query */` },
        quiz:[
          { q:'Which property smoothly animates a CSS change over time?', options:['animation-name','transition','transform','ease'], answer:1 },
          { q:'How do you read a CSS variable named --accent?', options:['var(--accent)','--accent()','$accent','get(--accent)'], answer:0 }
        ],
        quest:{
          title:'Pod Pulse', description:'Add a transition on .pod, a .pod:hover with transform: scale(1.05), and an @media (max-width: 600px) rule.',
          starter:`.pod{ background:#1a2050; color:#fff; padding:16px; border-radius:10px; display:inline-block; }\n`,
          validate:(files)=>{
            const css = files.css;
            const missing=[];
            if(!/\.pod\s*{[^}]*transition\s*:/.test(css)) missing.push('a transition on .pod');
            if(!/\.pod:hover\s*{[^}]*transform\s*:\s*scale/.test(css)) missing.push('.pod:hover with a scale() transform');
            if(!/@media[^{]*max-width\s*:\s*600px/.test(css)) missing.push('an @media (max-width:600px) block');
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Escape pod pulses with warp energy.'};
          }
        }
      }
    ],
    boss:{
      id:'css-int-boss', title:'Boss: Responsive Card Gallery', flavor:'The Gallery Warden only opens for a truly responsive layout.',
      description:'Build a card gallery: a grid container with repeat(auto-fit, minmax(...)) columns, hover transforms with transitions on cards, and a media query for small screens.',
      editorType:'css',
      files:{ html:`<div class="gallery">\n  <div class="card">A</div>\n  <div class="card">B</div>\n  <div class="card">C</div>\n</div>`, css:`.card{ background:#12173a; color:#fff; padding:24px; border-radius:12px; text-align:center; }\n/* build .gallery grid + hover transitions + media query */` },
      validate:(files)=>{
        const css = files.css.replace(/\s+/g,' ');
        const checks = [
          [/\.gallery\s*{[^}]*display\s*:\s*grid/.test(css), 'display:grid on .gallery'],
          [/grid-template-columns\s*:\s*repeat\(\s*auto-fit/.test(css), 'repeat(auto-fit, minmax(...)) columns'],
          [/\.card\s*{[^}]*transition\s*:/.test(css) || /\.card:hover/.test(css), 'a hover transition on .card'],
          [/@media/.test(css), 'a media query']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'The Warden steps aside. Gallery approved.'};
      }
    }
  },

  /* ============================= 6. JAVASCRIPT INTERMEDIATE ============================= */
  {
    id:'js-int', subject:'JavaScript', tier:'Intermediate', title:'JavaScript Intermediate — Signal Relay',
    summary:'DOM manipulation & events, fetch/JSON/async-await, localStorage & classes.',
    lessons:[
      {
        id:'js-int-1', title:'DOM Manipulation & Events',
        explanation:'You can create elements (document.createElement), change attributes/classes, and insert them (appendChild). addEventListener attaches behaviour to events like "click", "input" or "submit" without overwriting existing handlers.',
        syntax:`const btn = document.querySelector("#add");
btn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.textContent = "New item";
  document.querySelector("#list").appendChild(li);
});`,
        mistakes:[
          '<b>Using onclick="" in HTML</b> for anything nontrivial — addEventListener keeps behaviour in JS and allows multiple listeners.',
          '<b>Forgetting to append a created element</b> — createElement alone does not add it to the page.',
          '<b>Attaching listeners inside a loop incorrectly</b> — capturing the wrong loop variable can cause every listener to reference the last item.'
        ],
        editorType:'js',
        files:{ html:`<button id="add">Add</button>\n<ul id="list"></ul>`, js:`document.getElementById("add").addEventListener("click", () => {\n  const li = document.createElement("li");\n  li.textContent = "Relay node";\n  document.getElementById("list").appendChild(li);\n});` },
        quiz:[
          { q:'Which method creates a brand-new DOM element?', options:['document.newElement()','document.createElement()','document.addElement()','element.create()'], answer:1 },
          { q:'What attaches a click handler without overwriting existing ones?', options:['el.onclick = fn','el.addEventListener("click", fn)','el.click = fn','onclick="fn()"'], answer:1 }
        ],
        quest:{
          title:'Relay Node Spawner', description:'Add a click listener to #add that creates a <li> with text "Node" and appends it to #list.',
          starter:`// html: <button id="add"></button><ul id="list"></ul>\n`,
          validate:(files)=>{
            const js = files.js;
            const ok = /addEventListener\((['"])click\1/.test(js) && /createElement\((['"])li\1/.test(js) && /appendChild/.test(js);
            return ok ? {pass:true,message:'Relay node spawner online.'} : {pass:false,message:'Use addEventListener("click"...), createElement("li") and appendChild.'};
          }
        }
      },
      {
        id:'js-int-2', title:'Fetch, JSON & Async/Await',
        explanation:'fetch() requests data (often JSON) and returns a Promise. async/await lets you write asynchronous code that reads top-to-bottom instead of chained .then(). JSON.parse/JSON.stringify convert between JSON text and JS objects. In this offline app we simulate a network call with a Promise that resolves after a short delay.',
        syntax:`function mockFetch() {
  return new Promise(resolve => {
    setTimeout(() => resolve({ name: "Nova", crew: 4 }), 500);
  });
}
async function loadShip() {
  const data = await mockFetch();
  console.log(data.name, data.crew);
}
loadShip();`,
        mistakes:[
          '<b>Forgetting "await"</b> — without it you get a Promise object, not the resolved value.',
          '<b>Forgetting "async" on the function</b> that uses await — await only works inside an async function.',
          '<b>Not handling errors</b> — wrap awaited calls in try/catch since real network requests can fail.'
        ],
        editorType:'js',
        files:{ js:`function mockFetch(){\n  return new Promise(resolve => setTimeout(()=>resolve({ status:"docked" }), 300));\n}\nasync function run(){\n  const data = await mockFetch();\n  console.log(data.status);\n}\nrun();` },
        quiz:[
          { q:'What does "await" do inside an async function?', options:['Skips the Promise','Pauses until the Promise resolves, returning its value','Cancels the Promise','Converts it to JSON'], answer:1 },
          { q:'Which converts a JS object into a JSON string?', options:['JSON.parse()','JSON.stringify()','Object.toJSON()','String(obj)'], answer:1 }
        ],
        quest:{
          title:'Deep Space Ping', description:'Write an async function pingRelay() that awaits mockFetch() (provided) and logs `data.status`.',
          starter:`function mockFetch(){\n  return new Promise(resolve => setTimeout(()=>resolve({ status:"online" }), 200));\n}\n// write async function pingRelay() below and call it\n`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js, {timeoutMs:2500});
            if(r.error) return {pass:false,message:'Error: '+r.error};
            if(!r.logs.some(l=>/online/.test(l))) return {pass:false,message:'Log data.status from the awaited mockFetch() result.'};
            return {pass:true,message:'Ping received: relay online.'};
          }
        }
      },
      {
        id:'js-int-3', title:'LocalStorage & Classes',
        explanation:'localStorage.setItem/getItem persists small amounts of data in the browser between sessions (as strings — use JSON.stringify/parse for objects). Classes (class X { constructor(){} method(){} }) group related data and behaviour into reusable blueprints.',
        syntax:`class Ship {
  constructor(name) {
    this.name = name;
    this.fuel = 100;
  }
  launch() {
    this.fuel -= 10;
    return this.name + " launched!";
  }
}
const nova = new Ship("Nova");
console.log(nova.launch());
localStorage.setItem("shipName", nova.name);`,
        mistakes:[
          '<b>Storing objects directly</b> — localStorage only stores strings, so use JSON.stringify() going in and JSON.parse() coming out.',
          '<b>Forgetting "new"</b> when creating a class instance.',
          '<b>Forgetting "this."</b> inside class methods — without it you\'re referencing an undeclared variable, not the instance property.'
        ],
        editorType:'js',
        files:{ js:`class Ship {\n  constructor(name){\n    this.name = name;\n  }\n  status(){\n    return this.name + " is ready";\n  }\n}\nconst nova = new Ship("Nova");\nconsole.log(nova.status());` },
        quiz:[
          { q:'What data type does localStorage store natively?', options:['Objects','Strings','Numbers','Arrays'], answer:1 },
          { q:'Which keyword creates a new instance of a class?', options:['make','new','create','instance'], answer:1 }
        ],
        quest:{
          title:'Blueprint the Fleet', description:'Create a class Ship with a constructor(name) and a method launch() returning `name + " launched!"`. Instantiate one and log the result of launch().',
          starter:`// define class Ship, instantiate it, call launch()\n`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js);
            if(r.error) return {pass:false,message:'Error: '+r.error};
            if(!r.logs.some(l=>/launched/i.test(l))) return {pass:false,message:'Log the result of calling launch(), which should include "launched!".'};
            return {pass:true,message:'Fleet blueprint approved.'};
          }
        }
      }
    ],
    boss:{
      id:'js-int-boss', title:'Boss: Quest Tracker', flavor:'The Archive Keeper demands a working, persistent to-do quest tracker.',
      description:'Build a mini to-do app: a class Quest{constructor(text)}, an input+button to add quests as <li> to a <ul id="quests">, and save/load the quest list using localStorage (JSON.stringify/parse).',
      editorType:'js',
      files:{
        html:`<input id="qInput" placeholder="New quest...">\n<button id="qAdd">Add Quest</button>\n<ul id="quests"></ul>`,
        js:`class Quest {\n  constructor(text) { this.text = text; }\n}\n// add click handler on #qAdd that appends an <li> to #quests\n// bonus: persist to localStorage\n`
      },
      validate:(files)=>{
        const js = files.js;
        const checks = [
          [/class\s+Quest/.test(js), 'a class named Quest'],
          [/addEventListener\((['"])click\1/.test(js), 'a click listener'],
          [/createElement\((['"])li\1/.test(js), 'creating <li> elements'],
          [/appendChild/.test(js), 'appending items to the list'],
          [/localStorage/.test(js), 'using localStorage to persist quests']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Quest Tracker forged. The Archive Keeper bows.'};
      }
    }
  },

  /* ============================= 7. HTML EXPERT ============================= */
  {
    id:'html-exp', subject:'HTML', tier:'Expert', title:'HTML Expert — Deep Structure',
    summary:'Responsive structure, multimedia, canvas, SVG, iframes & professional page structure.',
    lessons:[
      {
        id:'html-exp-1', title:'Responsive Structure & Multimedia',
        explanation:'The <picture> element and srcset let the browser choose the right image for screen size/density. <video> and <audio> embed media with native controls. Professional pages combine semantic landmarks (<header>,<main>,<footer>) with a mobile-first mindset.',
        syntax:`<picture>
  <source srcset="hero-small.jpg" media="(max-width: 600px)">
  <img src="hero-large.jpg" alt="Fleet at dawn">
</picture>
<video src="brief.mp4" controls></video>`,
        mistakes:[
          '<b>Forgetting the controls attribute</b> on video/audio — without it users can\'t play/pause.',
          '<b>Not providing a fallback &lt;img&gt;</b> inside &lt;picture&gt; — it\'s required as the default source.',
          '<b>Using huge unoptimized images</b> for mobile — srcset exists specifically to avoid this.'
        ],
        editorType:'html',
        files:{ html:`<picture>\n  <img src="" alt="Fleet at dawn">\n</picture>` },
        quiz:[
          { q:'Which attribute gives native play/pause UI to <video>?', options:['autoplay','controls','loop','muted'], answer:1 },
          { q:'What is required inside a <picture> element?', options:['A <video> fallback','A fallback <img>','A <canvas>','Nothing'], answer:1 }
        ],
        quest:{
          title:'Signal Feed', description:'Add a <video> with a controls attribute and any src, plus an <img> with alt text.',
          starter:`<!-- build media markup -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const video = doc.querySelector('video[controls]');
            const img = doc.querySelector('img[alt]');
            if(!video) return {pass:false,message:'Add a <video controls> element.'};
            if(!img) return {pass:false,message:'Add an <img> with alt text.'};
            return {pass:true,message:'Signal feed broadcasting.'};
          }
        }
      },
      {
        id:'html-exp-2', title:'Canvas & SVG',
        explanation:'<canvas> is a raster drawing surface controlled entirely by JavaScript (getContext("2d")). <svg> is vector markup written directly in HTML — shapes stay crisp at any size and can be styled with CSS.',
        syntax:`<canvas id="c" width="200" height="100"></canvas>
<script>
  const ctx = document.getElementById("c").getContext("2d");
  ctx.fillStyle = "#8b5cf6";
  ctx.fillRect(10, 10, 80, 40);
</script>

<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" fill="#4f7cff"/>
</svg>`,
        mistakes:[
          '<b>Forgetting getContext("2d")</b> — a bare <canvas> has no drawing API until you get its context.',
          '<b>Scaling canvas with CSS width/height only</b> — this stretches the bitmap; set the width/height attributes for a crisp result.',
          '<b>Using canvas for simple icons</b> — SVG is usually simpler and scales better for static vector shapes.'
        ],
        editorType:'html',
        files:{ html:`<svg width="120" height="120">\n  <circle cx="60" cy="60" r="50" fill="#4f7cff"/>\n</svg>` },
        quiz:[
          { q:'Which is a vector format written directly as markup?', options:['<canvas>','<svg>','<img>','<video>'], answer:1 },
          { q:'What method gets a drawable context from <canvas>?', options:['getDrawing()','getContext("2d")','draw()','getCanvas()'], answer:1 }
        ],
        quest:{
          title:'Star Chart Sketch', description:'Add an <svg> containing at least one <circle> or <rect>, with a fill colour.',
          starter:`<!-- add your svg -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const shape = doc.querySelector('svg circle[fill], svg rect[fill]');
            return shape ? {pass:true,message:'Star chart plotted.'} : {pass:false,message:'Add an <svg> with a filled <circle> or <rect>.'};
          }
        }
      },
      {
        id:'html-exp-3', title:'Iframes & Professional Page Structure',
        explanation:'<iframe> embeds another document inside the current page (sandboxed for security when needed). Professional pages are organized: one <h1>, logical landmark regions, consistent heading order, and clean separation of structure (HTML), presentation (CSS) and behaviour (JS).',
        syntax:`<iframe src="map.html" title="Star map" width="300" height="200"></iframe>`,
        mistakes:[
          '<b>Missing a title attribute</b> on iframe — assistive tech needs it to describe the embedded content.',
          '<b>Embedding untrusted iframes without sandbox</b> — the sandbox attribute limits what an embedded page can do.',
          '<b>Sprinkling inline styles/scripts everywhere</b> — professional pages keep CSS/JS in separate files for maintainability.'
        ],
        editorType:'html',
        files:{ html:`<iframe title="Embedded map" src="about:blank" width="300" height="150"></iframe>` },
        quiz:[
          { q:'Why does <iframe> need a title attribute?', options:['SEO ranking boost','Accessibility — describes the embedded content','It\'s required for rendering','It sets the iframe\'s colour'], answer:1 },
          { q:'What does the sandbox attribute do on an iframe?', options:['Adds a border','Restricts embedded content\'s capabilities','Enlarges the iframe','Nothing in modern browsers'], answer:1 }
        ],
        quest:{
          title:'Embed the Star Map', description:'Add an <iframe> with a title attribute and a src of "about:blank".',
          starter:`<!-- your iframe -->\n`,
          validate:(files)=>{
            const doc = Validators.parseHTML(files.html);
            const f = doc.querySelector('iframe[title]');
            return f ? {pass:true,message:'Star map embedded.'} : {pass:false,message:'Add an <iframe> with a title attribute.'};
          }
        }
      }
    ],
    boss:{
      id:'html-exp-boss', title:'Boss: Multimedia Showcase Page', flavor:'The final Archivist requires a full multimedia showcase.',
      description:'Build a page containing: a <picture>/<img> with alt, a <video controls>, an <svg> shape, and an <iframe title="...">.',
      editorType:'html',
      files:{ html:`<!-- full multimedia showcase -->\n` },
      validate:(files)=>{
        const doc = Validators.parseHTML(files.html);
        const checks = [
          [!!doc.querySelector('img[alt]'), 'an <img> with alt text'],
          [!!doc.querySelector('video[controls]'), 'a <video controls>'],
          [!!doc.querySelector('svg'), 'an <svg> shape'],
          [!!doc.querySelector('iframe[title]'), 'an <iframe title="...">']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Showcase complete. The Archivist yields the final key.'};
      }
    }
  },

  /* ============================= 8. CSS EXPERT ============================= */
  {
    id:'css-exp', subject:'CSS', tier:'Expert', title:'CSS Expert — Glass & Light',
    summary:'Advanced layouts, glassmorphism, gradients, optimization, accessibility & component organization.',
    lessons:[
      {
        id:'css-exp-1', title:'Advanced Layouts',
        explanation:'grid-template-areas lets you name regions and place elements by name — very readable for complex layouts. z-index controls stacking order (only works on positioned elements). Combining Grid for macro-layout with Flexbox for micro-layout inside components is a common professional pattern.',
        syntax:`.layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 200px 1fr;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; z-index: 2; }`,
        mistakes:[
          '<b>Mismatched area names</b> between grid-template-areas and grid-area — they must match exactly.',
          '<b>Using z-index without position</b> — z-index only affects positioned elements (relative/absolute/fixed/sticky).',
          '<b>Overusing nested grids</b> when Flexbox would be simpler for a single row/column of items.'
        ],
        editorType:'css',
        files:{ html:`<div class="layout">\n  <div class="header">Header</div>\n  <div class="sidebar">Nav</div>\n  <div class="main">Main</div>\n</div>`, css:`.layout div{ background:#1a2050; color:#fff; padding:14px; }\n.layout {\n  /* build named grid areas */\n}` },
        quiz:[
          { q:'What must match grid-template-areas names?', options:['Class names','grid-area values','IDs','Nothing'], answer:1 },
          { q:'z-index has no effect unless an element has which property set?', options:['display','position (non-static)','color','width'], answer:1 }
        ],
        quest:{
          title:'Bridge Layout Matrix', description:'Use grid-template-areas to place .header and .sidebar/.main using named areas.',
          starter:`.layout {\n  display: grid;\n  /* template-areas + grid-area assignments */\n}`,
          validate:(files)=>{
            const css = files.css;
            const ok = /grid-template-areas/.test(css) && /grid-area\s*:\s*header/.test(css) && /grid-area\s*:\s*sidebar/.test(css);
            return ok ? {pass:true,message:'Bridge matrix locked in.'} : {pass:false,message:'Use grid-template-areas and assign grid-area to .header and .sidebar.'};
          }
        }
      },
      {
        id:'css-exp-2', title:'Glassmorphism & Gradients',
        explanation:'Glassmorphism combines a translucent background, backdrop-filter: blur(), and a subtle border to simulate frosted glass. linear-gradient()/radial-gradient() blend colours smoothly and pair well with this style in a blue/violet theme.',
        syntax:`.glass {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  background-image: linear-gradient(135deg, #4f7cff33, #8b5cf633);
}`,
        mistakes:[
          '<b>Forgetting a semi-transparent background</b> — backdrop-filter alone doesn\'t create the "glass" look without alpha transparency.',
          '<b>Overusing heavy blur</b> — large blur radii on many elements can hurt performance, especially on mobile.',
          '<b>Low contrast text on glass</b> — always double-check readability over varied backgrounds.'
        ],
        editorType:'css',
        files:{ html:`<div class="glass">Frosted Panel</div>`, css:`.glass{ padding:24px; border-radius:16px; color:#fff; }\n/* add translucency + blur + gradient */` },
        quiz:[
          { q:'Which property creates the frosted-glass blur effect?', options:['filter: blur()','backdrop-filter: blur()','opacity','box-shadow'], answer:1 },
          { q:'Which function blends multiple colours smoothly?', options:['blend()','linear-gradient()','mix-color()','fade()'], answer:1 }
        ],
        quest:{
          title:'Frost the Panel', description:'Give .glass a translucent background (rgba), backdrop-filter: blur, and a gradient background-image.',
          starter:`.glass{ padding:24px; border-radius:16px; color:#fff; }\n`,
          validate:(files)=>{
            const css = files.css;
            const missing=[];
            if(!/background(-color)?\s*:\s*rgba?\(/.test(css)) missing.push('a translucent rgba() background');
            if(!/backdrop-filter\s*:\s*blur/.test(css)) missing.push('backdrop-filter: blur(...)');
            if(!/linear-gradient|radial-gradient/.test(css)) missing.push('a gradient');
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Panel frosted to perfection.'};
          }
        }
      },
      {
        id:'css-exp-3', title:'Optimization, Accessibility & Component Organization',
        explanation:'Prefer transform/opacity for animations (cheap for the browser to composite). Respect prefers-reduced-motion for accessibility. Organize CSS by component (e.g. BEM naming like .card__title) and centralize repeated values in CSS variables so a single change updates the whole theme.',
        syntax:`@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
.card__title { font-weight: 700; }
.card__body { color: var(--text-dim); }`,
        mistakes:[
          '<b>Animating width/height/top/left</b> for motion — these trigger layout reflow; transform is far cheaper.',
          '<b>Ignoring prefers-reduced-motion</b> — some users get discomfort or nausea from excess motion.',
          '<b>Deeply nested, unnamed selectors</b> (.a .b .c .d) — a flatter, component-based naming scheme (BEM) is easier to maintain.'
        ],
        editorType:'css',
        files:{ html:`<div class="card">\n  <h3 class="card__title">Report</h3>\n  <p class="card__body">All systems go.</p>\n</div>`, css:`.card{ background:#12173a; padding:16px; border-radius:12px; }\n/* add a reduced-motion media query */` },
        quiz:[
          { q:'Which media feature detects a user\'s preference for less motion?', options:['(prefers-color-scheme)','(prefers-reduced-motion)','(prefers-contrast)','(min-motion)'], answer:1 },
          { q:'Which CSS properties are cheapest to animate?', options:['width & height','top & left','transform & opacity','margin & padding'], answer:2 }
        ],
        quest:{
          title:'Accessible Theme Pass', description:'Add an @media (prefers-reduced-motion: reduce) block that disables animation/transition.',
          starter:`.card{ background:#12173a; padding:16px; border-radius:12px; }\n`,
          validate:(files)=>{
            const css = files.css;
            const ok = /@media[^{]*prefers-reduced-motion/.test(css);
            return ok ? {pass:true,message:'Theme now respects reduced motion.'} : {pass:false,message:'Add an @media (prefers-reduced-motion: reduce) block.'};
          }
        }
      }
    ],
    boss:{
      id:'css-exp-boss', title:'Boss: Glassmorphic Dashboard UI', flavor:'The Architect grants passage only to a fully polished glass UI.',
      description:'Build a dashboard panel using grid-template-areas for layout, a glassmorphic card (blur+gradient+rgba), and a prefers-reduced-motion media query.',
      editorType:'css',
      files:{ html:`<div class="dash">\n  <div class="panel-a">Stats</div>\n  <div class="panel-b glass">Glass Panel</div>\n</div>`, css:`.dash div{ padding:18px; border-radius:14px; color:#fff; }\n/* full boss build */` },
      validate:(files)=>{
        const css = files.css.replace(/\s+/g,' ');
        const checks = [
          [/display\s*:\s*grid/.test(css) && /grid-template-areas/.test(css), 'a grid layout using grid-template-areas'],
          [/backdrop-filter\s*:\s*blur/.test(css), 'backdrop-filter: blur on the glass panel'],
          [/linear-gradient|radial-gradient/.test(css), 'a gradient'],
          [/prefers-reduced-motion/.test(css), 'a reduced-motion media query']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'The Architect nods. Dashboard approved.'};
      }
    }
  },

  /* ============================= 9. JAVASCRIPT EXPERT ============================= */
  {
    id:'js-exp', subject:'JavaScript', tier:'Expert', title:'JavaScript Expert — The Core Engine',
    summary:'Performance, modules, design patterns, advanced DOM & reusable components.',
    lessons:[
      {
        id:'js-exp-1', title:'Performance & Modules',
        explanation:'Debouncing delays a function until input pauses (great for search boxes); throttling limits how often a function runs (great for scroll/resize). ES Modules (export/import) split code into files with explicit, tree-shakeable dependencies instead of one big global script.',
        syntax:`function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
// export function helper() {}
// import { helper } from "./utils.js";`,
        mistakes:[
          '<b>Confusing debounce and throttle</b> — debounce waits for a pause; throttle guarantees a maximum rate.',
          '<b>Recreating the debounced function on every render/call</b> — define it once outside the hot path so the timer persists correctly.',
          '<b>Using modules without type="module"</b> on the script tag — import/export need that attribute in the browser.'
        ],
        editorType:'js',
        files:{ js:`function debounce(fn, delay){\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(()=>fn(...args), delay);\n  };\n}\nconst log = debounce((msg)=>console.log(msg), 200);\nlog("scan"); log("scan"); log("final scan");`},
        quiz:[
          { q:'Which technique waits until input pauses before running?', options:['Throttle','Debounce','Polling','Batching'], answer:1 },
          { q:'Which script attribute enables import/export in the browser?', options:['type="module"','defer','async','type="es6"'], answer:0 }
        ],
        quest:{
          title:'Sensor Debounce', description:'Implement debounce(fn, delay) and use it so only the LAST of three rapid calls logs.',
          starter:`function debounce(fn, delay) {\n\n}\nconst log = debounce((m)=>console.log(m), 100);\nlog("a"); log("b"); log("c");\n`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js, {timeoutMs:2000});
            if(r.error) return {pass:false,message:'Error: '+r.error};
            return {pass:true,message:'Debounce circuit calibrated.'};
          }
        }
      },
      {
        id:'js-exp-2', title:'Design Patterns',
        explanation:'The Module pattern uses closures/IIFEs to hide private state and expose a small public API — this whole app\'s Validators object uses exactly that pattern. The Observer pattern lets objects subscribe to and react to events. The Factory pattern centralizes object creation logic.',
        syntax:`const Counter = (() => {
  let count = 0;
  return {
    inc: () => ++count,
    value: () => count
  };
})();
console.log(Counter.inc(), Counter.value());`,
        mistakes:[
          '<b>Leaking private state</b> — if you return the variable directly instead of a getter, outside code can mutate it freely.',
          '<b>Overusing patterns for simple problems</b> — a pattern should simplify code, not add ceremony for its own sake.',
          '<b>Recreating the IIFE each time</b> instead of running it once and storing the result — that defeats the purpose of persisted private state.'
        ],
        editorType:'js',
        files:{ js:`const Fleet = (() => {\n  let ships = [];\n  return {\n    add: (name) => ships.push(name),\n    count: () => ships.length\n  };\n})();\nFleet.add("Nova");\nFleet.add("Kestrel");\nconsole.log(Fleet.count());` },
        quiz:[
          { q:'The Module pattern typically relies on which JS feature to hide state?', options:['Global variables','Closures','CSS','JSON'], answer:1 },
          { q:'Which pattern is about objects subscribing to and reacting to events?', options:['Factory','Singleton','Observer','Module'], answer:2 }
        ],
        quest:{
          title:'Observer Relay', description:'Build a simple Observer: an object with subscribe(fn) and emit(data) that calls all subscribed functions with data.',
          starter:`const Relay = (() => {\n  let subs = [];\n  return {\n    subscribe: (fn) => subs.push(fn),\n    emit: (data) => {\n      // call every subscriber with data\n    }\n  };\n})();\nRelay.subscribe((d)=>console.log("Got:", d));\nRelay.emit("Signal Alpha");`,
          validate: async (files)=>{
            const r = await Validators.runJsSandbox(files.js);
            if(r.error) return {pass:false,message:'Error: '+r.error};
            if(!r.logs.some(l=>/Signal Alpha/.test(l))) return {pass:false,message:'emit() should invoke each subscriber with the given data.'};
            return {pass:true,message:'Observer relay operational.'};
          }
        }
      },
      {
        id:'js-exp-3', title:'Advanced DOM & Reusable Components',
        explanation:'customElements.define() lets you create your own reusable HTML tags (Web Components) with encapsulated behaviour, backed by a class extending HTMLElement. This is the native-browser way to build reusable UI without a framework.',
        syntax:`class StatusLight extends HTMLElement {
  connectedCallback() {
    this.textContent = "●";
    this.style.color = this.getAttribute("state") === "ok" ? "#4ade80" : "#f87171";
  }
}
customElements.define("status-light", StatusLight);
// usage: <status-light state="ok"></status-light>`,
        mistakes:[
          '<b>Custom element names without a hyphen</b> — the spec requires at least one dash, e.g. "status-light" not "statuslight".',
          '<b>Doing setup in the constructor instead of connectedCallback</b> — attributes aren\'t guaranteed to be readable yet in the constructor.',
          '<b>Registering the same tag name twice</b> — customElements.define throws if called again for an existing name.'
        ],
        editorType:'js',
        files:{
          html:`<status-light state="ok"></status-light>`,
          js:`class StatusLight extends HTMLElement {\n  connectedCallback(){\n    this.textContent = "● " + this.getAttribute("state");\n  }\n}\ncustomElements.define("status-light", StatusLight);`
        },
        quiz:[
          { q:'What must every custom element tag name contain?', options:['A number','A hyphen','An uppercase letter','Nothing special'], answer:1 },
          { q:'Which lifecycle method runs when the element is added to the page?', options:['constructor()','connectedCallback()','render()','onMount()'], answer:1 }
        ],
        quest:{
          title:'Star Rating Component', description:'Create a custom element <star-rating value="4"> that sets its textContent to that many "★" characters in connectedCallback.',
          starter:`// html: <star-rating value="4"></star-rating>\nclass StarRating extends HTMLElement {\n  connectedCallback(){\n\n  }\n}\ncustomElements.define("star-rating", StarRating);`,
          starterHtml:`<star-rating value="4"></star-rating>`,
          validate:(files)=>{
            const js = files.js;
            const ok = /class\s+\w+\s+extends\s+HTMLElement/.test(js) && /connectedCallback/.test(js) && /customElements\.define/.test(js);
            return ok ? {pass:true,message:'Reusable component forged. Runs anywhere, no framework needed.'} : {pass:false,message:'Define a class extending HTMLElement with connectedCallback, then register it with customElements.define.'};
          }
        }
      }
    ],
    boss:{
      id:'js-exp-boss', title:'Boss: Reusable Star-Rating Component', flavor:'The Core Engine accepts only a fully working, reusable component.',
      description:'Build a <star-rating> web component: extends HTMLElement, reads a "value" attribute, and renders that many filled stars (★) plus empty stars (☆) up to 5 in connectedCallback.',
      editorType:'js',
      files:{
        html:`<star-rating value="3"></star-rating>`,
        js:`class StarRating extends HTMLElement {\n  connectedCallback() {\n    // read this.getAttribute("value"), render filled/empty stars\n  }\n}\ncustomElements.define("star-rating", StarRating);`
      },
      validate:(files)=>{
        const js = files.js;
        const checks = [
          [/class\s+\w+\s+extends\s+HTMLElement/.test(js), 'a class extending HTMLElement'],
          [/connectedCallback/.test(js), 'a connectedCallback method'],
          [/getAttribute\((['"])value\1\)/.test(js), 'reading the "value" attribute'],
          [/customElements\.define/.test(js), 'registering the element with customElements.define']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'The Core Engine hums to life. You are a Web Development Grandmaster!'};
      }
    }
  }

  ]
};
