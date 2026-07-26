/* =========================================================
   data-java.js — Java Academy curriculum (fully standalone:
   its own XP, levels, achievements, streak and quest log —
   nothing here shares state with the Web Dev Academy).

   NOTE ON EXECUTION: this is a 100% offline vanilla-JS app
   with no JVM available, so Java code is not truly compiled
   or run. Quests are checked by inspecting the code you write
   (keywords/structure), and the "Run" button shows a small,
   clearly-labelled *simulated* console for simple println
   statements — good for immediate feedback, not a real
   interpreter.
   ========================================================= */

const JAVA_ACADEMY = {
  id:'java',
  name:'Java Academy',
  tagline:'Master the JVM way of thinking — classes, objects and strict types.',
  chapters:[

  /* ============================= 1. JAVA BEGINNER ============================= */
  {
    id:'java-beg', subject:'Java', tier:'Beginner', title:'Java Beginner — Boot Sequence',
    summary:'Classes, the main method, variables/data types, operators, conditions, loops, arrays & methods.',
    lessons:[
      {
        id:'java-beg-1', title:'Classes, main() & Variables',
        explanation:'Every Java program lives inside a class, and execution starts at public static void main(String[] args). Java is statically typed: you declare a variable\'s type up front (int, double, boolean, String) and it cannot change.',
        syntax:`public class Main {
  public static void main(String[] args) {
    int fuel = 100;
    String shipName = "Nova";
    boolean docked = true;
    System.out.println(shipName + " fuel: " + fuel);
  }
}`,
        mistakes:[
          '<b>Forgetting the class must match the file name</b> — "Main.java" must contain "public class Main".',
          '<b>Wrong main signature</b> — it must be exactly public static void main(String[] args).',
          '<b>Missing semicolons</b> — unlike JS, Java never treats a newline as a statement end.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  public static void main(String[] args) {\n    int fuel = 100;\n    System.out.println("Fuel: " + fuel);\n  }\n}` },
        quiz:[
          { q:'Where does a Java program start executing?', options:['The first line of the file','public static void main(String[] args)','The class declaration','Any public method'], answer:1 },
          { q:'Is Java statically or dynamically typed?', options:['Dynamically typed','Statically typed','Neither','Depends on the JVM'], answer:1 }
        ],
        quest:{
          title:'Power Core Readout', description:'Declare an int named fuel and a String named shipName, then println a message using both.',
          starter:`public class Main {\n  public static void main(String[] args) {\n    // declare fuel and shipName, then println\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/int\s+fuel\s*=/.test(j), 'a declared int named fuel'],
              [/String\s+shipName\s*=/.test(j), 'a declared String named shipName'],
              [/System\.out\.println/.test(j), 'a System.out.println(...) call']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Power core readout compiled (simulated).'};
          }
        }
      },
      {
        id:'java-beg-2', title:'Operators, Conditions & Loops',
        explanation:'Java shares JS-like operators (+ - * / %, == for primitives, && || !) but String equality needs .equals(), not ==. if/else branches logic; for and while repeat it, exactly like JS in structure.',
        syntax:`for (int i = 0; i < 3; i++) {
  System.out.println("Scan " + i);
}
if (fuel > 50) {
  System.out.println("Safe to launch");
} else {
  System.out.println("Refuel first");
}`,
        mistakes:[
          '<b>Comparing Strings with ==</b> — this compares object references, not content; use .equals() instead.',
          '<b>Forgetting the loop variable\'s type</b> — "for (i = 0..." needs "for (int i = 0...".',
          '<b>Off-by-one bounds</b> — i <= array.length will throw an ArrayIndexOutOfBoundsException.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 3; i++) {\n      System.out.println("Tick " + i);\n    }\n  }\n}` },
        quiz:[
          { q:'How should you compare two Strings for equal content in Java?', options:['==','.equals()','===','.same()'], answer:1 },
          { q:'Which loop needs a typed counter variable declaration in Java?', options:['for (int i=0; ...)','for (i=0; ...)','Both work identically','Neither needs one'], answer:0 }
        ],
        quest:{
          title:'Diagnostic Sweep', description:'Write a for loop that prints "Sector X online" for X from 1 to 5.',
          starter:`public class Main {\n  public static void main(String[] args) {\n    // your for loop\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const ok = /for\s*\(\s*int\s+\w+\s*=\s*1/.test(j) && /System\.out\.println/.test(j) && /<=\s*5/.test(j);
            return ok ? {pass:true,message:'All 5 sectors report online (simulated).'} : {pass:false,message:'Use a for loop from 1 to 5 (inclusive) that prints each sector.'};
          }
        }
      },
      {
        id:'java-beg-3', title:'Arrays & Methods',
        explanation:'Arrays hold a fixed-size, typed collection: int[] nums = {1,2,3};. Methods are declared with a return type (or void), live inside a class, and can be static so main() can call them directly.',
        syntax:`public class Main {
  static String greet(String name) {
    return "Welcome, " + name;
  }
  public static void main(String[] args) {
    String[] crew = {"Kai", "Mira"};
    System.out.println(greet(crew[0]));
  }
}`,
        mistakes:[
          '<b>Forgetting the array\'s fixed size</b> — Java arrays cannot grow; use an ArrayList for dynamic sizing.',
          '<b>Non-static methods called from static main()</b> — a static method can only directly call other static methods without an instance.',
          '<b>Wrong return type</b> — a method declared void cannot use "return someValue;".'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  static String greet(String name) {\n    return "Welcome, " + name;\n  }\n  public static void main(String[] args) {\n    System.out.println(greet("Cadet"));\n  }\n}` },
        quiz:[
          { q:'Can a Java array change size after creation?', options:['Yes, always','No — arrays are fixed-size','Only primitive arrays','Only object arrays'], answer:1 },
          { q:'What must a static method call directly (without an instance)?', options:['Only instance methods','Only other static methods','Any method','Nothing, statics can\'t call methods'], answer:1 }
        ],
        quest:{
          title:'First Contact Method', description:'Write a static method reportStatus(String name) returning name + " is online", called from main and printed.',
          starter:`public class Main {\n  // define reportStatus(String name)\n  public static void main(String[] args) {\n    // call it and println the result\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/static\s+String\s+reportStatus\s*\(/.test(j), 'a static String reportStatus(...) method'],
              [/return[^;]*is online/.test(j) || /return[^;]*"\s*\+/.test(j), 'a return statement building the message'],
              [/reportStatus\s*\(/.test(j) && /System\.out\.println/.test(j), 'calling and printing reportStatus(...)']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'First contact established (simulated).'};
          }
        }
      }
    ],
    boss:{
      id:'java-beg-boss', title:'Boss: Number Guessing Logic', flavor:'The Boot Sentinel tests your grasp of core control flow.',
      description:'Write a static method checkGuess(int guess, int target) returning "Correct!", "Too high", or "Too low", then call it from main with a few sample guesses and println each result.',
      editorType:'java',
      files:{ java:`public class Main {\n  static String checkGuess(int guess, int target) {\n    // return the right message\n  }\n  public static void main(String[] args) {\n    System.out.println(checkGuess(5, 7));\n  }\n}` },
      validate:(files)=>{
        const j = files.java;
        const checks = [
          [/static\s+String\s+checkGuess\s*\(/.test(j), 'a static String checkGuess(int, int) method'],
          [/if\s*\(/.test(j) && /else/.test(j), 'if/else branching logic'],
          [/Too high/i.test(j) && /Too low/i.test(j) && /Correct/i.test(j), 'all three result messages'],
          [/System\.out\.println\s*\(\s*checkGuess/.test(j), 'calling and printing checkGuess(...) from main']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Boot Sentinel stands down. Core logic verified.'};
      }
    }
  },

  /* ============================= 2. JAVA INTERMEDIATE ============================= */
  {
    id:'java-int', subject:'Java', tier:'Intermediate', title:'Java Intermediate — Object Forge',
    summary:'OOP classes/objects/constructors, inheritance/interfaces/polymorphism, collections & exceptions.',
    lessons:[
      {
        id:'java-int-1', title:'Classes, Objects & Constructors',
        explanation:'A class is a blueprint; "new ClassName(...)" creates an object (instance). A constructor initializes an object\'s fields and shares the class\'s name with no return type.',
        syntax:`public class Ship {
  String name;
  int fuel;
  Ship(String name, int fuel) {
    this.name = name;
    this.fuel = fuel;
  }
  void launch() {
    System.out.println(name + " launches with " + fuel + " fuel");
  }
}
// Ship nova = new Ship("Nova", 100);
// nova.launch();`,
        mistakes:[
          '<b>Forgetting "this."</b> when a parameter shares a field\'s name — without it, Java can\'t tell them apart.',
          '<b>Giving a constructor a return type</b> — constructors never declare one, not even void.',
          '<b>Forgetting "new"</b> when creating an object — a class name alone is just a type, not an instance.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  static class Ship {\n    String name;\n    Ship(String name) { this.name = name; }\n    void status() { System.out.println(name + " is ready"); }\n  }\n  public static void main(String[] args) {\n    Ship nova = new Ship("Nova");\n    nova.status();\n  }\n}` },
        quiz:[
          { q:'What keyword refers to the current object\'s own field inside a method?', options:['self','this','me','current'], answer:1 },
          { q:'What does a constructor\'s return type look like?', options:['void','It has none at all','int','Object'], answer:1 }
        ],
        quest:{
          title:'Forge a Ship Class', description:'Create a Ship class with a constructor(String name) and a method status() that prints name + " is ready", then instantiate and call it.',
          starter:`public class Main {\n  static class Ship {\n    // fields + constructor + status()\n  }\n  public static void main(String[] args) {\n    // create a Ship and call status()\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/class\s+Ship/.test(j), 'a class named Ship'],
              [/Ship\s*\(\s*String/.test(j), 'a constructor accepting a String'],
              [/void\s+status\s*\(/.test(j), 'a status() method'],
              [/new\s+Ship\s*\(/.test(j), 'creating a Ship with "new"']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Ship class forged and launched (simulated).'};
          }
        }
      },
      {
        id:'java-int-2', title:'Inheritance, Interfaces & Polymorphism',
        explanation:'"extends" lets a subclass inherit fields/methods from a parent (and override them). An "interface" defines a contract of method signatures any implementing class must fulfil. Polymorphism means you can treat different subclasses through their shared parent/interface type.',
        syntax:`interface Pilotable {
  void pilot();
}
class Ship implements Pilotable {
  public void pilot() { System.out.println("Piloting ship"); }
}
class Fighter extends Ship {
  @Override
  public void pilot() { System.out.println("Piloting fighter"); }
}`,
        mistakes:[
          '<b>Forgetting @Override</b> — not required, but it catches typos in method signatures at compile time.',
          '<b>Implementing an interface without all its methods</b> — every method in the interface must be provided (unless the class is abstract).',
          '<b>Confusing "extends" and "implements"</b> — a class extends one class, but can implement multiple interfaces.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  interface Pilotable { void pilot(); }\n  static class Ship implements Pilotable {\n    public void pilot() { System.out.println("Piloting ship"); }\n  }\n  public static void main(String[] args) {\n    Pilotable p = new Ship();\n    p.pilot();\n  }\n}` },
        quiz:[
          { q:'How many classes can a class "extends"?', options:['Unlimited','Exactly one','Zero','Depends on the interface'], answer:1 },
          { q:'How many interfaces can a class "implements"?', options:['Only one','Zero or more','Exactly two','None'], answer:1 }
        ],
        quest:{
          title:'Polymorphic Fleet', description:'Create an interface Pilotable with pilot(), a class Fighter implementing it, and call pilot() through a Pilotable-typed variable.',
          starter:`public class Main {\n  interface Pilotable { void pilot(); }\n  // define class Fighter implements Pilotable\n  public static void main(String[] args) {\n    // Pilotable p = new Fighter(); p.pilot();\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/interface\s+Pilotable/.test(j), 'an interface named Pilotable'],
              [/implements\s+Pilotable/.test(j), 'a class implementing Pilotable'],
              [/Pilotable\s+\w+\s*=\s*new/.test(j), 'a Pilotable-typed variable holding the new object'],
              [/\.pilot\s*\(\s*\)/.test(j), 'calling pilot()']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Fleet responds polymorphically (simulated).'};
          }
        }
      },
      {
        id:'java-int-3', title:'Collections & Exception Handling',
        explanation:'ArrayList<T> is a resizable list; HashMap<K,V> stores key/value pairs — both far more flexible than raw arrays. try/catch handles runtime errors gracefully instead of crashing the program; throw raises your own exceptions.',
        syntax:`import java.util.ArrayList;
ArrayList<String> crew = new ArrayList<>();
crew.add("Kai");

try {
  int x = 10 / 0;
} catch (ArithmeticException e) {
  System.out.println("Error: " + e.getMessage());
}`,
        mistakes:[
          '<b>Forgetting the diamond &lt;&gt;</b> or the type parameter — ArrayList needs a type, e.g. ArrayList&lt;String&gt;.',
          '<b>Catching a too-broad or wrong exception type</b> — catch the specific exception you expect when possible.',
          '<b>Ignoring caught exceptions silently</b> — an empty catch block hides bugs; at minimum log the error.'
        ],
        editorType:'java',
        files:{ java:`import java.util.ArrayList;\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> crew = new ArrayList<>();\n    crew.add("Kai");\n    crew.add("Mira");\n    System.out.println("Crew size: " + crew.size());\n  }\n}` },
        quiz:[
          { q:'Which collection is a resizable, ordered list?', options:['int[]','ArrayList','HashMap','String'], answer:1 },
          { q:'Which block catches a runtime error so the program keeps running?', options:['if/else','try/catch','switch','for/each'], answer:1 }
        ],
        quest:{
          title:'Safe Cargo Manifest', description:'Create an ArrayList<String> of at least 2 items, and a try/catch block that catches an exception and prints a message.',
          starter:`import java.util.ArrayList;\npublic class Main {\n  public static void main(String[] args) {\n    // build the ArrayList and a try/catch\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/ArrayList<String>/.test(j), 'an ArrayList<String>'],
              [/\.add\s*\(/.test(j), 'adding items with .add(...)'],
              [/try\s*{/.test(j) && /catch\s*\(/.test(j), 'a try/catch block']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Manifest secured, exceptions handled (simulated).'};
          }
        }
      }
    ],
    boss:{
      id:'java-int-boss', title:'Boss: Inventory Manager', flavor:'The Forgemaster demands a robust inventory system.',
      description:'Build an Inventory class wrapping a HashMap<String,Integer>, with addItem(String,int) and getCount(String) methods, using a try/catch to guard against a missing item.',
      editorType:'java',
      files:{ java:`import java.util.HashMap;\npublic class Main {\n  static class Inventory {\n    HashMap<String, Integer> items = new HashMap<>();\n    void addItem(String name, int qty) {\n      // add/update qty in the map\n    }\n    int getCount(String name) {\n      // return quantity, or 0 if missing (use try/catch or getOrDefault)\n    }\n  }\n  public static void main(String[] args) {\n    Inventory inv = new Inventory();\n    inv.addItem("FuelCell", 5);\n    System.out.println(inv.getCount("FuelCell"));\n  }\n}` },
      validate:(files)=>{
        const j = files.java;
        const checks = [
          [/class\s+Inventory/.test(j), 'a class named Inventory'],
          [/HashMap<String\s*,\s*Integer>/.test(j), 'a HashMap<String, Integer> field'],
          [/void\s+addItem\s*\(/.test(j), 'an addItem(String, int) method'],
          [/int\s+getCount\s*\(/.test(j), 'a getCount(String) method'],
          [/try\s*{/.test(j) || /getOrDefault/.test(j), 'safe missing-item handling (try/catch or getOrDefault)']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'Inventory Manager forged. The Forgemaster steps aside.'};
      }
    }
  },

  /* ============================= 3. JAVA EXPERT ============================= */
  {
    id:'java-exp', subject:'Java', tier:'Expert', title:'Java Expert — The JVM Core',
    summary:'Generics & streams, multithreading basics, and design patterns in Java.',
    lessons:[
      {
        id:'java-exp-1', title:'Generics & Streams',
        explanation:'Generics (class Box<T>) let a class or method work with any type while keeping compile-time type safety. The Stream API (list.stream().filter(...).map(...).collect(...)) processes collections in a declarative, functional style.',
        syntax:`class Box<T> {
  T value;
  Box(T value) { this.value = value; }
  T get() { return value; }
}

import java.util.List;
List<Integer> nums = List.of(1,2,3,4,5);
long evenCount = nums.stream().filter(n -> n % 2 == 0).count();`,
        mistakes:[
          '<b>Using raw types</b> (List instead of List&lt;String&gt;) — you lose compile-time type checking.',
          '<b>Forgetting streams are lazy</b> — nothing runs until a terminal operation like collect()/count()/forEach() is called.',
          '<b>Mutating outside state inside a stream lambda</b> — streams are meant to be side-effect-free where possible.'
        ],
        editorType:'java',
        files:{ java:`import java.util.List;\npublic class Main {\n  public static void main(String[] args) {\n    List<Integer> nums = List.of(1,2,3,4,5);\n    long evenCount = nums.stream().filter(n -> n % 2 == 0).count();\n    System.out.println("Even: " + evenCount);\n  }\n}` },
        quiz:[
          { q:'What do generics give you at compile time?', options:['Faster runtime','Type safety without casting','Automatic multithreading','Smaller file size'], answer:1 },
          { q:'What triggers a stream pipeline to actually execute?', options:['Any method call','A terminal operation like collect()/count()','Declaring the stream','Nothing, it runs immediately'], answer:1 }
        ],
        quest:{
          title:'Generic Cargo Box', description:'Create a generic class Box<T> with a get() method, instantiate it with a String, and print the result of get().',
          starter:`public class Main {\n  static class Box<T> {\n    // field + constructor + get()\n  }\n  public static void main(String[] args) {\n    // Box<String> b = new Box<>("Cargo"); println b.get()\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/class\s+Box<T>/.test(j), 'a generic class Box<T>'],
              [/T\s+get\s*\(\s*\)/.test(j), 'a get() method returning T'],
              [/new\s+Box<>/.test(j) || /new\s+Box<String>/.test(j), 'instantiating Box with a type']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Generic cargo box compiled (simulated).'};
          }
        }
      },
      {
        id:'java-exp-2', title:'Multithreading Basics',
        explanation:'A Thread runs code concurrently. You can extend Thread and override run(), or (preferably) implement Runnable and pass it to a Thread. Call .start() to actually launch a new thread — calling run() directly just executes it on the current thread.',
        syntax:`class Worker implements Runnable {
  public void run() {
    System.out.println("Working on: " + Thread.currentThread().getName());
  }
}
Thread t = new Thread(new Worker());
t.start();`,
        mistakes:[
          '<b>Calling run() instead of start()</b> — run() executes synchronously on the caller\'s thread; only start() spins up a new one.',
          '<b>Sharing mutable state across threads unsafely</b> — this can cause race conditions without synchronization.',
          '<b>Assuming thread execution order</b> — the scheduler decides order; never rely on threads finishing in the order they were started.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  static class Worker implements Runnable {\n    public void run() { System.out.println("Worker running"); }\n  }\n  public static void main(String[] args) {\n    Thread t = new Thread(new Worker());\n    t.start();\n  }\n}` },
        quiz:[
          { q:'Which call actually starts a new thread of execution?', options:['run()','start()','execute()','go()'], answer:1 },
          { q:'What is the preferred way to define thread work in modern Java?', options:['extends Thread only','implements Runnable','Static methods only','It cannot be done'], answer:1 }
        ],
        quest:{
          title:'Parallel Scan', description:'Create a class ScannerTask implementing Runnable with a run() method that prints a scan message, and start it on a Thread.',
          starter:`public class Main {\n  static class ScannerTask implements Runnable {\n    // run()\n  }\n  public static void main(String[] args) {\n    // new Thread(new ScannerTask()).start();\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/implements\s+Runnable/.test(j), 'a class implementing Runnable'],
              [/void\s+run\s*\(\s*\)/.test(j), 'a run() method'],
              [/new\s+Thread\s*\(/.test(j) && /\.start\s*\(\s*\)/.test(j), 'creating a Thread and calling .start()']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Parallel scan launched (simulated).'};
          }
        }
      },
      {
        id:'java-exp-3', title:'Design Patterns in Java',
        explanation:'Singleton ensures only one instance of a class exists, via a private constructor and a static getInstance() method. Factory centralizes object creation behind a method, hiding "new" calls and which concrete subclass gets built.',
        syntax:`class Logger {
  private static Logger instance;
  private Logger() {}
  static Logger getInstance() {
    if (instance == null) instance = new Logger();
    return instance;
  }
  void log(String msg) { System.out.println("[LOG] " + msg); }
}
// Logger.getInstance().log("Boot complete");`,
        mistakes:[
          '<b>Public constructor on a Singleton</b> — it must be private so "new" can\'t be called from outside.',
          '<b>Forgetting the null check</b> in getInstance() — without it you\'d create a new object every call, defeating the pattern.',
          '<b>Overusing Singleton</b> for things that aren\'t truly single-instance — it can make testing harder if misused.'
        ],
        editorType:'java',
        files:{ java:`public class Main {\n  static class Logger {\n    private static Logger instance;\n    private Logger() {}\n    static Logger getInstance() {\n      if (instance == null) instance = new Logger();\n      return instance;\n    }\n    void log(String msg) { System.out.println("[LOG] " + msg); }\n  }\n  public static void main(String[] args) {\n    Logger.getInstance().log("Boot complete");\n  }\n}` },
        quiz:[
          { q:'What must a Singleton\'s constructor be?', options:['public','private','protected','static'], answer:1 },
          { q:'What does the Factory pattern centralize?', options:['Object creation logic','Database queries','Thread scheduling','CSS styling'], answer:0 }
        ],
        quest:{
          title:'Thread-Safe Singleton Logger', description:'Build a Logger singleton with a private constructor, a static getInstance(), and a log(String) method, then use it from main.',
          starter:`public class Main {\n  static class Logger {\n    // private static instance, private constructor, getInstance(), log()\n  }\n  public static void main(String[] args) {\n    // Logger.getInstance().log("...")\n  }\n}`,
          validate:(files)=>{
            const j = files.java;
            const checks = [
              [/private\s+Logger\s*\(\s*\)/.test(j), 'a private constructor'],
              [/static\s+Logger\s+getInstance\s*\(/.test(j), 'a static getInstance() method'],
              [/void\s+log\s*\(\s*String/.test(j), 'a log(String) method'],
              [/Logger\.getInstance\(\)\.log/.test(j), 'calling Logger.getInstance().log(...)']
            ];
            const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
            if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
            return {pass:true,message:'Singleton Logger online. You are a Java Grandmaster!'};
          }
        }
      }
    ],
    boss:{
      id:'java-exp-boss', title:'Boss: The JVM Core Trial', flavor:'The final Core requires generics, threading and a pattern working together.',
      description:'Build a generic Repository<T> class with an ArrayList<T> store and an add(T)/getAll() API, implemented as a Singleton (private constructor + static getInstance), and demonstrate adding an item from inside a Runnable thread.',
      editorType:'java',
      files:{ java:`import java.util.ArrayList;\nimport java.util.List;\npublic class Main {\n  static class Repository<T> {\n    private static Repository instance;\n    private ArrayList<T> store = new ArrayList<>();\n    private Repository() {}\n    static Repository getInstance() {\n      if (instance == null) instance = new Repository();\n      return instance;\n    }\n    void add(T item) { store.add(item); }\n    List<T> getAll() { return store; }\n  }\n  public static void main(String[] args) {\n    Runnable task = () -> Repository.getInstance().add("Entry");\n    new Thread(task).start();\n  }\n}` },
      validate:(files)=>{
        const j = files.java;
        const checks = [
          [/class\s+Repository<T>/.test(j), 'a generic class Repository<T>'],
          [/private\s+Repository\s*\(\s*\)/.test(j), 'a private constructor (Singleton)'],
          [/static\s+Repository\s+getInstance/.test(j), 'a static getInstance() method'],
          [/new\s+Thread\s*\(/.test(j) && /\.start\s*\(\s*\)/.test(j), 'running work on a Thread'],
          [/\.add\s*\(/.test(j), 'adding an item to the repository']
        ];
        const missing = checks.filter(c=>!c[0]).map(c=>c[1]);
        if(missing.length) return {pass:false,message:'Missing: '+missing.join(', ')+'.'};
        return {pass:true,message:'The JVM Core stabilizes. Java Academy complete!'};
      }
    }
  }

  ]
};
