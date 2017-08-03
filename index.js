"use strict";

let MessagingHub = require('messaginghub-client');
let WebSocketTransport = require('lime-transport-websocket');
let Lime = require('lime-js');

let client = new MessagingHub.ClientBuilder()
    .withIdentifier('chatbotparateste')
    .withAccessKey('dk9SbjR4OTk5RnJlTmprdUxsYXY=')
    .withTransportFactory(() => new WebSocketTransport())
    .build();

client.connect()

.then(() => {

        console.log('BOT CONNECTADO!');

        //Toda mensagem que chegar vai ser logada no console
        client.addMessageReceiver((m) => true, (m) => {
            console.log(m);
            //Passa a execução para o proximo receiver.
            return true;
        });

        //Recebe todas as mensagens
        client.addMessageReceiver((m) => true, (m) => {
            let command = {
                "id": Lime.Guid(),
                "method": "get",
                "uri": "/buckets/" + encodeURIComponent(m.from.split('/')[0])
            };

            client.sendCommand(command)
                .then(userSession => {
                    if (m.type == 'text/plain' && m.content.toLowerCase().trim().indexOf("contato") != -1) {
                        let command = {
                            "id": Lime.Guid(),
                            "method": "delete",
                            "uri": "/buckets/" + encodeURIComponent(m.from.split('/')[0])
                        };

                        client.sendCommand(command);

                        let message = {
                            id: Lime.Guid(),
                            type: 'text/plain',
                            content: 'Telefone de contato da empresa: +55 (31) 2527 5258, link para o site: https://www.eteg.com.br/ ',
                            to: m.from
                        };

                        client.sendMessage(message);
                    }
                    else {
                        let message = null;

                        switch (userSession.resource.sessionState) {
                            case 'Opinou':
                                message = {
                                    id: Lime.Guid(),
                                    type: 'text/plain',
                                    content: 'Obrigado pelo feedback!',
                                    to: m.from
                                };
								 let command = {
												"id": Lime.Guid(),
												"method": "delete",
												"uri": "/buckets/" + encodeURIComponent(m.from.split('/')[0])
											};
								 client.sendCommand(command);
							
                                break;

                            case 'Menu':
                                if (m.type == 'text/plain'
                                    && (m.content.toLowerCase().trim() == 'o que sei fazer'
                                        || m.content.toLowerCase().trim() == 'defesa do meu uso'
										|| m.content.toLowerCase().trim() == '1'
										|| m.content.toLowerCase().trim() == '2')) {

                                    let command = {
                                        "id": Lime.Guid(),
                                        "method": "set",
                                        "uri": "/buckets/" + encodeURIComponent(m.from.split('/')[0]),
                                        "type": "application/json",
                                        "resource": {
                                            "sessionState": "Opinou"
                                        }
                                    };

                                    client.sendCommand(command);

                                    if (m.content.toLowerCase().trim() == 'o que sei fazer' || m.content.toLowerCase().trim() == '1') {
                                         message = {
													id: Lime.Guid(),
													type: 'text/plain',
													content: 'Um ChatBot serve para simular uma conversa humana por meio auditivo ou visual. ChatBot são comumente usados para realizar tarefas práticas como atendimento ao cliente ou requisição de informações. \n \n Por favor, me avalie com os conceitos: "Adorei", "Gostei", "Não Gostei" ou "Odiei"',
													to: m.from
												};
                                    }
                                    else {
                                       message = {
													id: Lime.Guid(),
													type: 'text/plain',
													content: 'Links de defesa do uso de um chatbot: https://www.botware.com.br/por-que-usar-chatbots-no-atendimento-a-seus-clientes/ \n , http://exame.abril.com.br/tecnologia/o-que-sao-chatbots-os-robos-que-vao-invadir-seu-smartphone/ \n, https://www.agorapulse.com/pt/blog/usar-chatbots-do-facebook-para-mensagens \n, http://chatbotsbrasil.take.net/chatbot-com-inteligencia-artificial-conheca-as-vantagens/ \n, http://agenciamulticom.com.br/site/tendencias-por-que-usar-chatbots-no-relacionamento-com-o-cliente/ . \n \n Por favor, me avalie com os conceitos: "Adorei", "Gostei", "Não Gostei" ou "Odiei"',
													to: m.from
												};
                                    }
                                }
                                else {
                                   message = {
                            "id": Lime.Guid(),
                            "to": m.from,
                            "type": "application/vnd.lime.select+json",
                            "content": {
                                "text": "Olá, sou o ChatBot do Gustavo Malta, por gentileza escolha uma das opções abaixo: ",
                                "options": [
                                    {
                                        "order": 1,
                                        "text": "O que sei fazer"
                                    },
                                    {
                                        "order": 2,
                                        "text": "Defesa do meu uso"
                                    }
                                ]
                            }
                        };
                                }
                                break;
                        };

                        client.sendMessage(message);
                    }
                })
                .catch((err) => {
                    let message = {};

                   
                          message = {
                            "id": Lime.Guid(),
                            "to": m.from,
                            "type": "application/vnd.lime.select+json",
                            "content": {
                                "text": "Olá, sou o ChatBot do Gustavo Malta, por gentileza escolha uma das opções abaixo: ",
                                "options": [
                                    {
                                        "order": 1,
                                        "text": "O que sei fazer"
                                    },
                                    {
                                        "order": 2,
                                        "text": "Defesa do meu uso"
                                    }
                                ]
                            }
                        };
                    

                    client.sendMessage(message);
					
					 let command = {
                            "id": Lime.Guid(),
                            "method": "set",
                            "uri": "/buckets/" + encodeURIComponent(m.from.split('/')[0]),
                            "type": "application/json",
                            "resource": {
                                "sessionState": "Menu"
                            }
                        };

                        //Grava a sessão do usuário no servidor
                        client.sendCommand(command);
                });
        });
    })
    .catch((err) => console.error(err));;