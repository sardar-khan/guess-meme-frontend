import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import { Connection, PublicKey } from "@solana/web3.js"
import { wallet } from "../components/PlaceTrade/config"
import testidl from "./testidl.json"

import * as buffer from 'buffer'
export const testPumpFunTokenBondingCurve = async () => {
    try {
        window.Buffer = buffer.Buffer

        const mintaddy = new PublicKey("9DNFjMdeuDGKiBEbkZ7tcQ85rAWhsv8kYMmyKNCPpump")
        const programId = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");
        const conn = new Connection("https://go.getblock.io/23d2dbf8dbe44a109200929f7abb4534", { commitment: "finalized" });
        const provider = new AnchorProvider(conn, wallet, { commitment: "processed", });

        const program = new Program(testidl, programId, provider)


        window.Buffer = buffer.Buffer;
        const [C] = PublicKey.findProgramAddressSync(
            [Buffer.from('bonding-curve'), mintaddy.toBuffer()],
            programId,
        );
        console.log("bonding curve", C?.toBase58())
        const r = await program.account.bondingCurve.fetch(C);
        console.log("r", r)
        const {
            realSolReserves,
            virtualTokenReserves,
            virtualSolReserves,
            realTokenReserves,
            tokenTotalSupply,
            complete = false, // Default value if not present
        } = r;

        // Convert BN objects to strings
        const virtualTokenReservesStr = virtualTokenReserves.toString();
        const virtualSolReservesStr = virtualSolReserves.toString();
        const realTokenReservesStr = realTokenReserves.toString();
        const tokenTotalSupplyStr = tokenTotalSupply.toString();
        console.log("bondingcurve", {
            realSolReserves: realSolReserves?.toString(),
            virtualTokenReserves: virtualTokenReservesStr,
            virtualSolReserves: virtualSolReservesStr,
            realTokenReserves: realTokenReservesStr,
            tokenTotalSupply: tokenTotalSupplyStr,
            complete: complete,

        })

        const reservedTokens=new BN(206900000).mul(new BN(1000_000));
        console.log("reservedTokens",reservedTokens?.toString())
   const initialRealTokenReserves=tokenTotalSupply.sub(reservedTokens);
   console.log("initialRealTokenReserves",initialRealTokenReserves ?.toString())

   const bondingCurveProgress= new BN(100).sub(realTokenReserves.mul(new BN(100)).div(initialRealTokenReserves))
console.log("prog", bondingCurveProgress.toString(10))


    } catch (error) {
        console.log("errpr", error)
    }
}

export function calculateBondingCurveProgresstest(balance) {
    // Constants
    const TOTAL_SUPPLY = 1_000_000_000;
    const RESERVED_TOKENS = 206_900_000;
    const INITIAL_REAL_TOKEN_RESERVES = TOTAL_SUPPLY - RESERVED_TOKENS; // 793,100,000

    // Input validation
    if (typeof balance !== 'number' || isNaN(balance)) {
        throw new Error('Balance must be a valid number');
    }

    // Check if balance is less than reserved tokens
    if (balance < RESERVED_TOKENS) {
        return 100; // When balance is minimum, progress is 100%
    }

    // Calculate leftTokens
    const leftTokens = balance - RESERVED_TOKENS;

    // Calculate progress
    const progress = 100 - ((leftTokens * 100) / INITIAL_REAL_TOKEN_RESERVES);
    console.log(Math.max(progress, 0), 100)
    // Ensure progress is between 0 and 100
    return Math.min(Math.max(progress, 0), 100);

}