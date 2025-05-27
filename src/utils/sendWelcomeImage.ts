import { createCanvas, loadImage } from 'canvas';
import {
    AttachmentBuilder,
    EmbedBuilder,
    GuildMember,
    TextChannel,
} from 'discord.js';

export async function sendWelcomeImage(
    member: GuildMember,
    channel: TextChannel
) {
    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    // Fondo negro
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    try {
        // Cargar avatar (forzamos .png)
        const avatarURL = member.user.displayAvatarURL({
            size: 512,
            extension: 'png',
        });
        const avatar = await loadImage(avatarURL);

        // Coordenadas centradas
        const avatarSize = 128;
        const x = canvas.width / 2 - avatarSize / 2;
        const y = canvas.height / 2 - avatarSize / 2 - 20;

        // Recorte circular
        ctx.save();
        ctx.beginPath();
        ctx.arc(
            x + avatarSize / 2,
            y + avatarSize / 2,
            avatarSize / 2,
            0,
            Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, y, avatarSize, avatarSize);
        ctx.restore();

        // Texto de bienvenida
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Sans';
        ctx.textAlign = 'center';
        ctx.fillText(
            `¡Bienvenido, ${member.user.username}!`,
            canvas.width / 2,
            canvas.height - 30
        );

        // Crear imagen adjunta
        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
            name: 'welcome.png',
        });

        // Crear embed con la imagen
        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('🎉 Nuevo miembro en la comunidad')
            .setImage('attachment://welcome.png');

        // Enviar mensaje de texto + embed
        await channel.send({
            content: `👋 ¡Bienvenido/a al servidor, <@${member.id}>!`,
            embeds: [embed],
            files: [attachment],
        });
    } catch (error) {
        console.error('Error generando la imagen de bienvenida:', error);

        // Fallback por si falla canvas o avatar
        await channel.send(
            `👋 ¡Bienvenido/a al servidor, <@${member.id}>! (no se pudo cargar la imagen 😢)`
        );
    }
}
