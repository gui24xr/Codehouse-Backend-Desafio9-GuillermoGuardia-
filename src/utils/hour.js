function transformDate(receivedDate){

    const fecha = new Date(receivedDate)

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
    const año = fecha.getFullYear();

    // Formatear la fecha como "dd/mm/yyyy"
    const fechaFormateada = `${dia}/${mes}/${año}`;

    // Obtener la hora, minutos y segundos
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    // Formatear la hora como "hh:mm:ss"
    const horaFormateada = `${hora}:${minutos}:${segundos}`;

    return {date:fechaFormateada,hour:horaFormateada}
}

export {transformDate}