import fetch from 'node-fetch';
import { HttpError } from 'routing-controllers';

import { Logger } from '../lib/logger';

const log = new Logger(__filename);

/**
 * методы для корректной арифметики
 */
export const math = {

    correctMultiplication: (firstOperand: number, secondOperand: number): number => {
        const firstAccuracy = firstOperand.toString().includes('.') ? firstOperand.toString().split('.')[1].length : 0;
        const secondAccuracy = secondOperand.toString().includes('.') ? secondOperand.toString().split('.')[1].length : 0;
        const integerMultiplication = Number(((firstOperand * Math.pow(10, firstAccuracy)) * (secondOperand * Math.pow(10, secondAccuracy))).toFixed(0));
        const result = Number((integerMultiplication / Math.pow(10, (firstAccuracy + secondAccuracy))).toFixed(firstAccuracy + secondAccuracy));
        return result;
    },

    /**
     * @param operands
     */
    correctMultiplicationFromArray: (operands: number[]): number => {
        // log.info('correctMultiplicationFromArray start', { operands });

        let firstOperand;
        let secondOperand;
        let multiplication = 1;

        for (const operand of operands) { // let i = 0; i < operands.length ; i++
            firstOperand = multiplication;
            secondOperand = operand;
            if (secondOperand === undefined) {
                break;
            }
            multiplication = math.correctMultiplication(firstOperand, secondOperand);
        }

        // log.info('correctMultiplicationFromArray end', { sum });
        return multiplication;
    },

    correctAddition: (firstOperand: number, secondOperand: number): number => {
        // log.info('correctAddition start', { firstOperand, secondOperand });
        const firstAccuracy = firstOperand.toString().includes('.') ? firstOperand.toString().split('.')[1].length : 0;
        const secondAccuracy = secondOperand.toString().includes('.') ? secondOperand.toString().split('.')[1].length : 0;
        const accuracy = Math.max(firstAccuracy, secondAccuracy);
        const integerMultiplication = Number(((firstOperand * Math.pow(10, accuracy)) + (secondOperand * Math.pow(10, accuracy))).toFixed(0));
        const result = Number((integerMultiplication / Math.pow(10, (accuracy))).toFixed(accuracy));
        // log.info('correctAddition end', { sum: result });
        return result;
    },

    /**
     * @param operands
     */
    correctAdditionFromArray: (operands: number[]): number => {
        // log.info('correctAdditionFromArray start', { operands });

        let firstOperand;
        let secondOperand;
        let sum = 0;

        for (const operand of operands) { // let i = 0; i < operands.length ; i++
            firstOperand = sum;
            secondOperand = operand;
            if (secondOperand === undefined) {
                break;
            }
            sum = math.correctAddition(firstOperand, secondOperand);
        }

        // log.info('correctAdditionFromArray end', { sum });
        return sum;
    },

    /** округление вверх с указанной точностью (при большом количестве знаков после запятой теряет стабильность) */
    ceilWithAccuracy: (value: number, accuracy: number): number => {
        return parseFloat(Math.ceil(parseFloat(value + `e+${accuracy}`)) + `e-${accuracy}`);
    },

    /** округление вниз с указанной точностью (при большом количестве знаков после запятой теряет стабильность) */
    floorWithAccuracy: (value: number, accuracy: number): number => {
        return parseFloat(Math.floor(parseFloat(value + `e+${accuracy}`)) + `e-${accuracy}`);
    },

};

export async function fetchesAsJson(
    options: { url: string; init?: any }[],
    querySettings?: {
        /** выбрасывать ли ошибку при неудачном запросе */
        throwError?: boolean
        /** паузы в мс между запросами */
        requestTimeOut?: number
        /** настройки для чанкования запросов */
        chunk?: {
            /** количество запросов в одном чанке */
            requestAmount: number
            /** паузы в мс между чанками */
            timeOut: number
        }
        returnFullResponse?: boolean
    }
): Promise<{ success: boolean; data: { body: any; fullResponse: Response | null }[]; errorMessage?: string; headers?: any[] }> {
    try {
        let requestAmount = 1;
        const fetchPromises = [];
        for (const { url, init } of options) {
            if (querySettings && querySettings.requestTimeOut) {
                await new Promise((resolve) => setTimeout(resolve, querySettings.requestTimeOut));
            }
            if (querySettings && querySettings.chunk && requestAmount++ % querySettings.chunk.requestAmount === 0) {
                await new Promise((resolve) => setTimeout(resolve, querySettings.chunk.timeOut));
            }
            fetchPromises.push(fetch(url, init).catch(error => {
                throw new Error(error.message);
            }));
        }
        const fetchResponses = await Promise.all(fetchPromises).catch(error => {
            throw new Error(error.message);
        });
        for (const fetchResponse of fetchResponses) {
            if (!fetchResponse.ok) {
                log.error('[helper::fetchesAsJson] Request failed', { fetchResponse });
                throw new Error(fetchResponse.status);
            }
        }
        const responses = await Promise.all(fetchResponses.map(fetchResponse => {
            return {
                body: fetchResponse.json().catch(error => {
                    throw new Error(error.message);
                }),
                fullResponse: querySettings?.returnFullResponse ? fetchResponse : null,
            };
        }));
        return { success: true, data: responses };
    } catch (error) {
        if (querySettings?.throwError) {
            log.error('[helper::fetchesAsJson] Fetch failed', { error });
            throw new HttpError(500, 'Server error');
        }
        return { success: false, data: [], errorMessage: error.message };
    }
}

export async function sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
