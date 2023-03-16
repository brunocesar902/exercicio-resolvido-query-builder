const knex = require('../conexao');

const listar = async (req, res) => {
    try {
        const usuarios = await knex('usuarios');
        return res.status(200).json(usuarios);
        
    } catch (error) {
        return res.status(400).json(error.usuarios);
    };
};


const obter = async (req, res) => {
    const { id } = req.params;

    try {
        const usuarios = await knex('usuarios').where({ id }).first();
        
        if (!usuarios) {
            return res.status(404).json('Usuários não encontrado');
        }

        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(400).json(error.message);
    };

};


const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json('O nome é obrigatório.')
    }

    if (!email) {
        return res.status(404).json('O email é obrigatório.')
    }

    if (!senha) {
        return res.status(404).json('O senha é obrigatório.')
    }

    try {
        const usuario = await knex.insert({ nome, email, senha }).into('usuarios').returning('*');
        
        if (!usuario) {
            return res.status(400).json('Não foi possível cadastrar o usuário.')
        }
         
        return res.status(200).json(usuario[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


const atualizar = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.params;

    console.log(nome, email, senha);

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json('Usuário não encontrado.');
        }
        
        const usuario = await knex('usuarios')
            .update({ nome, email, senha })
            .where({ id });
        
        if(!usuario) {
            return res.status(400).json('Não foi possível atualizar o usuário.');
        }
        
        return res.status(200).json('Usuário atualizado.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};


const excluir =  async (req, res) => {
    const { id } = req.params;
    
    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();
        
        if (!usuarioExiste) {
            return res.status(404).json('Usuário não encontrado.');          
        }
        
        const usuario = await knex('usuarios')
            .del()
            .where({ id });
        
        if(!usuario) {
            return res.status(400).json('Não foi possível excluir o usuário.');
        }
        

        return res.status(200).json('Usuário deletado.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listar,
    obter,
    cadastrar,
    atualizar,
    excluir
}