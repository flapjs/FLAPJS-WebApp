
/**
 * A function for checking in polynomial time if an inputString can be derived from
 * a CFG that is in Chomsky Normal Form (CNF). It is based off the CYK algorithm
 * https://en.wikipedia.org/wiki/CYK_algorithm
 *
 * @param {CFG} CFG in Chomsky Normal Form to check derivation of inputString
 * @param {String} String to test accept or reject by CFG
 * @returns {Boolean} True if inputString can be derived by CNF, false otherwise
 */
export function solveChomsky(cnf, inputString)
{
    const length = inputString.length;            // n
    const varCount = cnf.getVariables().length;     // r
    const varMap = getVarMap(cnf);                  // Map variables to increasing numbers, Start variable = 0
    const terminalIndicies = getTerminalIndicies(inputString); // Map each terminal to a list of indicies they appear in inputString
    const parseTable = [];

    //Initialize a P[n, n, r] to false. For any substring of length l, starting at index s,
    //successfuly generated from CNF variable_r, set P[l - 1, s, r] to true
    for(let i = 0; i < length; i++)
    {
        let perStartIndex = [];
        for(let j = 0; j < length; j++)
        {
            let perVariable = [];
            for(let k = 0; k < varCount; k++)
            {
                perVariable.push(false);
            }
            perStartIndex.push(perVariable);
        }
        parseTable.push(perStartIndex);
    }

    //Set all unit productions to true
    const unitProductions = getUnitProductions(cnf, varMap);
    for(let startIndex = 0; startIndex < length; startIndex++)
    {
        for(const unitProduction of unitProductions)
        {
            let stringLen = 0;  //Length of 1 in 0 based indexing
            let variableNum = unitProduction[0];
            let terminal = unitProduction[1];

            for(const startIndex of terminalIndicies.get(terminal))
            {
                parseTable[stringLen][startIndex][variableNum] = true;
            }
        }
    }

    const doubleVariableProductionTuples = getDoubleVariableProductionTriTuple(cnf, varMap);

    // Test substrings of length 2 up to the entire length (for 0 based indexing, it starts from 1)
    for(let stringLen = 2; stringLen <= length; stringLen++)
    {
        for(let spanStart = 1; spanStart <= length - stringLen + 1; spanStart++)
        {
            for(let partition = 1; partition <= stringLen - 1; partition++)
            {
                for(const tuple of doubleVariableProductionTuples)
                {
                    // A -> BC
                    let A = 0; let B = 1; let C = 2;
                    if(parseTable[ partition - 1 ][ spanStart - 1][ tuple[B] ] &&
                        parseTable[ stringLen - partition - 1 ][ spanStart + partition - 1][ tuple[C] ])
                    {
                        parseTable[ stringLen - 1 ][ spanStart - 1 ][ tuple[A] ] = true;
                    }
                }
            }
        }
    }

    if(parseTable[ length - 1 ][0][0])
    {
        return true;
    }
    else
    {
        return false;
    }

}

function getVarMap(cnf)
{
    const startVariable = cnf.getStartVariable();
    const variables = cnf.getVariables();
    const varMap = new Map();

    varMap.set(startVariable, 0);

    let counter = 1;
    for(const variable of variables)
    {
        if(variable !== startVariable && !varMap.has(variable))
        {
            varMap.set(variable, counter++);
        }
    }

    return varMap;
}

function getTerminalIndicies(inputString)
{
    const terminalIndicies = new Map();

    for(let i = 0 ; i < inputString.length; i++)
    {
        let c = inputString.charAt(i);
        if(terminalIndicies.has(c))
        {
            let updatedList = terminalIndicies.get(c);
            updatedList.push(i);
            terminalIndicies.set(c, updatedList);
        }
        else
        {
            terminalIndicies.set(c, [i]);
        }
    }

    return terminalIndicies;
}

// List of pairs [varNum, terminal]
function getUnitProductions(cnf, varMap)
{
    const rules = cnf.getRules();
    const terminals = cnf.getTerminals();
    const unitProductions = []

    for(let i = 0 ; i < rules.length; i++)
    {
        const rhs = rules[i].getRHS();
        const variable = rules[i].getLHS();

        //Is this rule a unit production (Var -> Terminal)
        if(rhs.length == 1 && terminals.has(rhs))
        {
            unitProductions.push( [varMap.get(variable), rhs] );
        }
    }
}

//For A -> BC return (varMap(A), varMap(B), varMap(C))
function getDoubleVariableProductionTriTuple(cnf, varMap)
{
    const rules = cnf.getRules();
    const variables = cnf.getVariables();
    const tuples = [];

    for(const rule of rules)
    {
        const rhs = rule.getRHS();
        if( rhs.length == 2 && cnf.hasVariable(rhs.charAt(0)) && cnf.hasVariable(rhs.charAt(1)) )
        {
            let A = varMap.get(rule.getLHS());
            let B = varMap.get(rhs.charAt(0));
            let C = varMap.get(rhs.charAt(1));
            tuples.push([A, B, C]);
        }
    }

    return tuples;
}
