const express = require('express');
const pool = require('./db');
require('dotenv').config();


const candidatosRouter  = require('./routes/candidatos');
const softSkillsRouter  = require('./routes/softSkills');
const formacaoRouter    = require('./routes/formacao');
const experienciaRouter = require('./routes/experiencia');
const hardSkillsRouter  = require('./routes/hardSkills');

const app = express();
app.use(express.json());


app.use('/api/candidatos', candidatosRouter);


app.use('/api/candidatos/:id/soft-skills',  softSkillsRouter);
app.use('/api/candidatos/:id/formacao',     formacaoRouter);
app.use('/api/candidatos/:id/experiencia',  experienciaRouter);
app.use('/api/candidatos/:id/hard-skills',  hardSkillsRouter);


app.use('/api/soft-skills',  softSkillsRouter);
app.use('/api/formacao',     formacaoRouter);
app.use('/api/experiencia',  experienciaRouter);
app.use('/api/hard-skills',  hardSkillsRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
    console.log('──────────────────────────────────────────');
    console.log('📋 CANDIDATOS');
    console.log(`   GET    http://localhost:${PORT}/api/candidatos`);
    console.log(`   GET    http://localhost:${PORT}/api/candidatos/:id/curriculo`);
    console.log(`   POST   http://localhost:${PORT}/api/candidatos`);
    console.log(`   PUT    http://localhost:${PORT}/api/candidatos/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/candidatos/:id`);
    console.log('──────────────────────────────────────────');
    console.log('🧠 SOFT SKILLS');
    console.log(`   GET    http://localhost:${PORT}/api/candidatos/:id/soft-skills`);
    console.log(`   POST   http://localhost:${PORT}/api/candidatos/:id/soft-skills`);
    console.log(`   PUT    http://localhost:${PORT}/api/soft-skills/:skillId`);
    console.log(`   DELETE http://localhost:${PORT}/api/soft-skills/:skillId`);
    console.log('──────────────────────────────────────────');
    console.log('🎓 FORMAÇÃO ACADÊMICA');
    console.log(`   GET    http://localhost:${PORT}/api/candidatos/:id/formacao`);
    console.log(`   POST   http://localhost:${PORT}/api/candidatos/:id/formacao`);
    console.log(`   PUT    http://localhost:${PORT}/api/formacao/:formacaoId`);
    console.log(`   DELETE http://localhost:${PORT}/api/formacao/:formacaoId`);
    console.log('──────────────────────────────────────────');
    console.log('💼 EXPERIÊNCIA PROFISSIONAL');
    console.log(`   GET    http://localhost:${PORT}/api/candidatos/:id/experiencia`);
    console.log(`   POST   http://localhost:${PORT}/api/candidatos/:id/experiencia`);
    console.log(`   PUT    http://localhost:${PORT}/api/experiencia/:expId`);
    console.log(`   DELETE http://localhost:${PORT}/api/experiencia/:expId`);
    console.log('──────────────────────────────────────────');
    console.log('💡 HARD SKILLS');
    console.log(`   GET    http://localhost:${PORT}/api/candidatos/:id/hard-skills`);
    console.log(`   POST   http://localhost:${PORT}/api/candidatos/:id/hard-skills`);
    console.log(`   PUT    http://localhost:${PORT}/api/hard-skills/:skillId`);
    console.log(`   DELETE http://localhost:${PORT}/api/hard-skills/:skillId`);
    console.log('──────────────────────────────────────────\n');

    
    try {
        await pool.query('SELECT 1');
        console.log('✅ Conexão com o NeonDB estabelecida com sucesso!\n');
    } catch (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
    }
});
