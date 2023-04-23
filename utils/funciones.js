function validarToken(token) {
    const resultado = secretData.validateToken(token);
    return resultado
    if (resultado.estado) {
        return true;
    } else {
        return false;
    };
};