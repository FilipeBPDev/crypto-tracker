import { deleteOldRecords } from "../DAO/cryptoHistoryDAO.js";

export const startCleanHistoryService = () => {
    const ONE_DAY = 24 * 60 * 60 * 1000;

    //funcition de limpeza
    const clean = async () => {
        try {
            const result = await deleteOldRecords(7);
            console.log(`[service] limpeza automática: ${result.affectedRows} registros removidos`);
        } catch (error) {
            console.error("[service] erro na limpeza automática:", error);
        }
    }

    clean();

    setInterval(clean, ONE_DAY);
}