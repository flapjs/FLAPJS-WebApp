# Motivations

The Regular Expression module will allow users to define and edit Regular Expressions and interact with them through string testing, converting to Nondeterministic Finite Automata, importing and exporting.  

# Goals

- [x] RE class
- [x] REParser
- [x] RE to NFA conversion
- [x] MachineController
- [x] REModule.js
- [x] UI (forms) for defining/editing REs
- [x] UI for seeing Terminals
- [x] RE string testing
- [x] Import REs
- [x] Export REs

# Theory

### Regular Expressions

Regular Expressions are used to represent Regular languages. An expression is made of a combination of terminals, operators (concatenation and union), and quantifiers (Kleene Star and Kleene Plus).

An example RE that describes the language of all strings the begin and end with a 1

    1(0 U 1)*1

### Converting to Nondeterministic Finite Automata

Regular Expressions and Finite Automata have the same expressive power, and we can algorithmically define NFAs that describe the same language as REs using [Thompson's  construction algorithm](https://en.wikipedia.org/wiki/Thompson%27s_construction).

The basic idea is that from any two unit NFAs, you can combine them into a compound NFA that represents an operation between the two unit NFAs (e.g. Union). Every unit NFA has one start and one final state. Building from unit NFAs that represent terminals or EMPTY, we can combine them to represent unions, concats, Kleene Star, etc. to make subexpressions, which themselves have one start and one final state, so that they might be unit NFAs to other combinations.

This means that from a parsed regular expression, Thompson's construction algorithm could be applied recursively to build an equivalent NFA. Enter parsing.

In order to do the parsing, we created a parser that would build an Abstract Syntax Tree from reading a regular expression from left to right. General rules of the tree for the RE AST:

- The leaves are all terminals/EMPTY
- An operator node's children (1/2 for unary/binary operators) represent the operands
- Higher precedence operators usually become children to lower precedence operators and vice versa (Kleene Star > Concat > Union)
- An open parenthesis starts a subtree that ends at a closing parenthesis, at which case any treatment of the parenthesis bound expression as an operand will use the root open parenthesis node as the operand

Once parsed as a tree, for any operator node encountered, you can recursively construct NFAs for each of its operators, and then perform the construction for that operator. Doing so at the root node of the parse tree will convert the entire RE into an NFA.

# Ideas

### RE class


### REParser


### ConvertRE

# Dangers/Pitfalls




# Work Log
