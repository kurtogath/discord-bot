export async function logError(context: string, error: unknown) {
    let message = '';
    let stack = '';

    if (error instanceof Error) {
        message = error.message;
        stack = error.stack ?? '';
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = JSON.stringify(error);
    }

    try {
        const { PostgreSQL } = await import('../db/PostgreSQL'); // ✅ lazy import
        const db = PostgreSQL.getInstance();

        await db.addData(
            `INSERT INTO "Logs" ("Context", "Message", "StackTrace") VALUES ($1, $2, $3)`,
            [context, message, stack]
        );
    } catch (dbError) {
        console.error('[Logger] Error al guardar en la base de datos:', dbError);
        console.error('[Logger] Error original:', message, stack);
    }
}
