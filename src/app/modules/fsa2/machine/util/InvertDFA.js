import FSA from '../FSA.js';

export function invertDFA(fsa, dst = new FSA(true))
{
    dst.copy(fsa);

    const toBeRejected = new Set(dst.getFinalStates());
    for (const state of dst.getStates())
    {
        if (toBeRejected.has(state))
        {
            dst.setFinalState(state, false);
        }
        else
        {
            dst.setFinalState(state, true);
        }
    }

    return dst;
}
