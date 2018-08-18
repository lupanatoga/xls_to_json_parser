const parseJSONResponse = (response) => {

    const contracheque_sheet = response["Contracheque"];
    const subsidio_sheet = response["Subsídio - Direitos Pessoais"];
    const indenizacoes_sheet = response["Indenizações"];
    const direitos_eventuais = response["Direitos Eventuais"];
    const dados_cadastrais = response["Dados Cadastrais"];

    let orgao;
    let mes_ano_referencia;

    const parseNumber = (stringNumber) => {
        if (!stringNumber) return 0;
        const formatedString = stringNumber.replace(/,/g, '').replace('R$', '').trim();
        return formatedString !== '-' ? parseFloat(formatedString) : 0;
    };

    const servidoresMap = {};


    contracheque_sheet.forEach((linha) => {
        if (linha.length > 0 && linha[0] === 'Órgão') {
            linha = linha.filter((campo) => !!campo);
            orgao = linha[1];
        }

        if (linha.length > 0 && linha[0] === 'Mês/Ano de Referência') {
            linha = linha.filter((campo) => !!campo);
            mes_ano_referencia = linha[1];
        }

        if(linha.length > 0 && linha[0] && linha[0].includes('xxx')) {

            let [cpf, nome, cargo, lotacao, subsidio, direitos_pessoais, indenizacoes,
                direitos_eventuais, total_de_rendimentos, previdencia_publica,
                imposto_de_renda, descontos_diversos, retencao_por_teto_constitucional,
                total_de_descontos, rendimento_liquido, remuneracao_do_orgao_de_origem,
                diarias] = linha;

            subsidio = parseNumber(subsidio);
            direitos_pessoais = parseNumber(direitos_pessoais);
            indenizacoes = parseNumber(indenizacoes);
            direitos_eventuais = parseNumber(direitos_eventuais);
            total_de_rendimentos = parseNumber(total_de_rendimentos);
            previdencia_publica = parseNumber(previdencia_publica);
            imposto_de_renda = parseNumber(imposto_de_renda);
            descontos_diversos = parseNumber(descontos_diversos);
            retencao_por_teto_constitucional = parseNumber(retencao_por_teto_constitucional);
            total_de_descontos = parseNumber(total_de_descontos);
            rendimento_liquido = parseNumber(rendimento_liquido);
            remuneracao_do_orgao_de_origem = parseNumber(remuneracao_do_orgao_de_origem);
            diarias = parseNumber(diarias);

            const servidor = {
                nome, cargo, lotacao, subsidio, direitos_pessoais, indenizacoes,
                direitos_eventuais, total_de_rendimentos, previdencia_publica,
                imposto_de_renda, descontos_diversos, retencao_por_teto_constitucional,
                total_de_descontos, rendimento_liquido, remuneracao_do_orgao_de_origem,
                diarias, orgao, mes_ano_referencia
            };

            servidoresMap[nome] = servidor;
        }
    });


    subsidio_sheet.forEach((linha) => {
        if(linha.length > 0 && linha[0] && linha[0].includes('xxx')) {
            let [cpf, nome, abono_de_permanencia, subsidio_outra1, subsidio_detalhe1,
                subsidio_outra2, subsidio_detalhe2, total_de_direitos_pessoais] = linha;

            const servidor = servidoresMap[nome];

            abono_de_permanencia = parseNumber(abono_de_permanencia);
            subsidio_outra1 = parseNumber(subsidio_outra1);
            subsidio_outra2 = parseNumber(subsidio_outra2);
            total_de_direitos_pessoais = parseNumber(total_de_direitos_pessoais);

            subsidio_detalhe1 = subsidio_detalhe1 || '';
            subsidio_detalhe2 = subsidio_detalhe2 || '';


            const dadosSubsidioServidor = {
                nome, abono_de_permanencia, subsidio_outra1, subsidio_detalhe1,
                subsidio_outra2, subsidio_detalhe2, total_de_direitos_pessoais
            };

            servidoresMap[nome] = Object.assign(servidor, dadosSubsidioServidor);
        }
    });

    indenizacoes_sheet.forEach((linha) => {
        if(linha.length > 0 && linha[0] && linha[0].includes('xxx')) {
            let [cpf, nome, auxilio_alimentacao, auxilio_pre_escolar, auxilio_saude,
                auxilio_natalidade, auxilio_moradia, ajuda_de_custo, indenizacoes_outra1,
                indenizacoes_detalhe1, indenizacoes_outra2, indenizacoes_detalhe2,
                indenizacoes_outra3, indenizacoes_detalhe3, total_indenizacoes] = linha;

            const servidor = servidoresMap[nome];


            auxilio_alimentacao = parseNumber(auxilio_alimentacao);
            auxilio_pre_escolar = parseNumber(auxilio_pre_escolar);
            auxilio_saude = parseNumber(auxilio_saude);
            auxilio_natalidade = parseNumber(auxilio_natalidade);
            auxilio_moradia = parseNumber(auxilio_moradia);
            ajuda_de_custo = parseNumber(ajuda_de_custo);
            indenizacoes_outra1 = parseNumber(indenizacoes_outra1);
            indenizacoes_outra2 = parseNumber(indenizacoes_outra2);
            indenizacoes_outra3 = parseNumber(indenizacoes_outra3);
            total_indenizacoes = parseNumber(total_indenizacoes);

            indenizacoes_detalhe1 = indenizacoes_detalhe1 || '';
            indenizacoes_detalhe2 = indenizacoes_detalhe2 || '';
            indenizacoes_detalhe3 = indenizacoes_detalhe3 || '';

            const dadosIndenizacoesServidor = {
                nome, auxilio_alimentacao, auxilio_pre_escolar, auxilio_saude,
                auxilio_natalidade, auxilio_moradia, ajuda_de_custo, indenizacoes_outra1,
                indenizacoes_detalhe1, indenizacoes_outra2, indenizacoes_detalhe2,
                indenizacoes_outra3, indenizacoes_detalhe3, total_indenizacoes
            };

            servidoresMap[nome] = Object.assign(servidor, dadosIndenizacoesServidor);
        }
    });

    direitos_eventuais.forEach((linha) => {
        if(linha.length > 0 && linha[0] && linha[0].includes('xxx')) {
            let [cpf, nome, abono_contitucional_de_1_3_de_ferias, indenizacao_de_ferias, antecipacao_de_ferias,
                gratificacao_natalina, antecipacao_de_gratificacao_natalina, substituicao, gratificacao_por_exercicio_cumulativo,
                gratificacao_por_encargo_curso_concurso, pagamento_em_retroativos, jeton, direitos_eventuais_outra1, direitos_eventuais_detalhe1,
                direitos_eventuais_outra2, direitos_eventuais_detalhe2, total_de_direitos_eventuais] = linha;

            const servidor = servidoresMap[nome];


            abono_contitucional_de_1_3_de_ferias = parseNumber(abono_contitucional_de_1_3_de_ferias);
            indenizacao_de_ferias = parseNumber(indenizacao_de_ferias);
            antecipacao_de_ferias = parseNumber(antecipacao_de_ferias);
            gratificacao_natalina = parseNumber(gratificacao_natalina);
            antecipacao_de_gratificacao_natalina = parseNumber(antecipacao_de_gratificacao_natalina);
            substituicao = parseNumber(substituicao);
            gratificacao_por_exercicio_cumulativo = parseNumber(gratificacao_por_exercicio_cumulativo);
            gratificacao_por_encargo_curso_concurso = parseNumber(gratificacao_por_encargo_curso_concurso);
            pagamento_em_retroativos = parseNumber(pagamento_em_retroativos);
            jeton = parseNumber(jeton);
            direitos_eventuais_outra1 = parseNumber(direitos_eventuais_outra1);
            direitos_eventuais_outra2 = parseNumber(direitos_eventuais_outra2);
            total_de_direitos_eventuais = parseNumber(total_de_direitos_eventuais);

            direitos_eventuais_detalhe1 = direitos_eventuais_detalhe1 || '';
            direitos_eventuais_detalhe2 = direitos_eventuais_detalhe2 || '';

            const dadosDireitosEventuaisServidor = {
                nome, abono_contitucional_de_1_3_de_ferias, indenizacao_de_ferias, antecipacao_de_ferias,
                gratificacao_natalina, antecipacao_de_gratificacao_natalina, substituicao, gratificacao_por_exercicio_cumulativo,
                gratificacao_por_encargo_curso_concurso, pagamento_em_retroativos, jeton, direitos_eventuais_outra1, direitos_eventuais_detalhe1,
                direitos_eventuais_outra2, direitos_eventuais_detalhe2, total_de_direitos_eventuais
            };


            servidoresMap[nome] = Object.assign(servidor, dadosDireitosEventuaisServidor);
        }
    });

    dados_cadastrais.forEach((linha) => {
        if(linha.length > 0 && linha[0] && linha[0].includes('xxx')) {
            let [cpf, nome, matricula, lotacao_de_origem, orgao_de_origem, cargo_de_origem] = linha;

            const servidor = servidoresMap[nome];


            const dadosCadastraisServidor = {
                nome, matricula, lotacao_de_origem, orgao_de_origem, cargo_de_origem
            };

            servidoresMap[nome] = Object.assign(servidor, dadosCadastraisServidor);
        }
    });

    const servidoresArray = [];

    for (servidorKey in servidoresMap) {
        const servidor = servidoresMap[servidorKey];
        servidoresArray.push(servidor);

    }

    return servidoresArray;
};

module.exports = {parseJSONResponse};