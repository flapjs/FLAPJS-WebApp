# Motivations

Similar to the Regular Expression module, the CFG module will allow users to define Context Free Grammars and interact with them through string testing, converting to Push Down Automata, editing and saving.  

# Goals

- [x] CFG class
- [x] MachineController
- [x] CFGModule.js
- [ ] UI (forms) for defining/editing CFGs
- [ ] UI for seeing Variables, Terminals, Formal Definitions (etc)
- [x] CFG to PDA conversion
- [ ] CFG string testing
- [ ] Save CFGs

# Theory

### Context Free Grammars

A Context Free Grammars is a type of formal grammar made up of substitution rules/productions to describe all possible strings in a language. It is defined by a 4 tuple <i>G = (V, &#x3a3;, R, S)</i>
        - V => Variables: Nonterminal characters
        - &#x3a3; => Terminals: Alphabet of the language, disjoint from variables
        - R => Rules: Relations mapping V to (V U &#x3a3;)*
        - S => Start Variable: Used to kick off the substitution

An example CFG that describes the language 00\*11\*

    S -> CD
    C -> 0C | 0
    D -> 1D | 1

In this example, S, C, and D are Variables, S being the Start Variable (usually the lhs variable of the first rule). The terminals are 0 and 1. Each line is a rule and defines what each variable on the left hand side can be recursively substituted to. Variables can be replaced with other variables, terminals, or both.  

### Converting to Pushdown Automata

Context Free Grammars and Pushdown Automata have the same expressive power, and we can algorithmically define PDAs that describe the same language as CFGs. There is a wonderful Youtube [video](https://www.youtube.com/watch?v=xWWRoiPRAi4&amp=&t=748s) that explains the algorithm we use, but the basic rules are listed below

1. Push a $ on the stack to make the bottom of the stack
2. Push the starting variable of the CFG
3. At a looping state (q_loop), for each rule, replace the lhs variable with the rightmost symbol of the rhs, then push the rest of the symbols from right to left
4. At q_loop, pop every terminal
5. Go to accept state after popping the $ from the stack

The basic idea is that terminals are simply popped the stack, and variables have their corresponding rules pushed to the stack so that we can continue to substitute variables.

# Ideas

### CFG class

CFG.js contains two classes: Rules and CFG, which are both inspired by Production and Grammar classes of JFlap as well as RE.js from FlapJS.

A Rule just contains two strings, the left hand side (lhs) and the right hand side (rhs) of the arrow usually drawn when writing rules. **All strings meant to be lhs and rhs have all white space removed**

A CFG has a set of Variables, a set of Terminals, a list of Rules, and a starting variable. Similar to RE, it also stores its errors from validation in a list. Aside from setting and getting all the fields, adding a rule can automatically update the variables and terminals (currently be making the lhs of a rule a Variable and adding non PIPE and EMPTY characters as terminals). This function is called <code>addRule</code> and it also allows the user to add rules including pipes on the rhs to represent multiple substitutions (e.g. S -> A | B)

### ConvertCFGtoPDA

The conversion algorithm is the same as described [above](#converting-to-push-down-automata). However, it first checks if the CFG is valid, then it separates rules that use pipe into multiple rules for each subsititution (S -> A | B becomes two rules: S -> A and S -> B). Otherwise, it just follows the algorithm and returns a PDA representing the CFG

# Dangers/Pitfalls

- Currently, when the CFG adds and verifies rules, it makes/expects uppercase letters to Variables and all other symbols (excluding PIPE and EMPTY) as terminals. This can be limiting if we want to use non-capital letters for Variables and/or we want to use capital letters for terminals.

    - **Resolved** *One of the rules of CFG's is that all variables must eventually derive to an empty string or a terminal, which means that for every variable, there must be a rule defined where it is on the lhs, so I will just get my variables from all the lhs's of the rules instead of just from the uppercase!


- The validation for CFGs does not check whether it is a  proper CFG (unreachable symbols, cycles, etc), which we might want to allow the user to fail with as a part of learning, but heads up
- While I was testing ConvertCFGtoPDA and testing some strings on the PDA, I noticed that some strings would fail even though they were supposed to be in the language, and then realized it wasn't my code, but it's because there is a max amount of computation steps in SolvePDA. For some strings, it is probably taking too long, and it's not always based on length (I had some longer strings pass while shorter ones didn't).


# Work Log

5/13/19 - Seth

This is the first entry, and although I will add entries for every change I make progressively, I'll just sum up what has been done up to this point. Two weeks ago I wrote CFG.js, which defines the CFG class. Last week I wrote ConvertCFGtoPDA but it has yet to be tested. And finally, I wrote this markdown file.

5/14/19 - Seth

While testing, I was able to do some debugging
 - It is important to distinguish the EMPTY character that can be in a CFG from the EMPTY_SYMBOL that it ultimately has to become as a label for the transition in a PDA
 - While validating, I had only checked if the character was equal to its upper case form, which is always true for numbers (that should be terminals, not variables). So I had to change it to check it is an alpha char first.
 - Had a bug in separating rules by pipe that was just caused by a type between this.rules and this._rules, which was the difference between actually saving the changes and pulling my hair out
 I've done a few test cases and it looks like she's running well
