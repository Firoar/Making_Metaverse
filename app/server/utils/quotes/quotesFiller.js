import { Quotes } from "../../models/Quotes.js";
import { printErrorInGoodWay } from "../printErrors.js";
import { AllQuotes } from "./quotes.js";

export const fillQuotesTable = async () => {
  const count = await Quotes.count();
  if (count === 0) {
    for (let arr of AllQuotes) {
      for (let quoteObj of arr) {
        try {
          await Quotes.create({
            quote: quoteObj.q,
            author: quoteObj.a,
          });
        } catch (error) {
          if (error.name === "SequelizeUniqueConstraintError") {
            // do nothing
          } else {
            console.error(`Error adding quote: ${quoteObj.q}`, error);
          }
        }
      }
    }

    printErrorInGoodWay(
      "Successfully filled Quotes Table (skipped duplicates)"
    );
  }
};
