'use client';
import { Card, Col, Row } from 'antd';

import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    //validar se o usuario tem o perfil
    //Se houver necessidade de um perfil especifico para a pagina.
    /*if (!auth?.user?.perfisSistemaAtual?.includes(perfisSistema.ADM)){
      if(!auth?.user?.perfisSistemaAtual?.includes(perfisSistema.ATENDENTE)){
        auth?.logoutSSO();
      }
    }*/
    //No meu caso aqui nao é preciso pois a tela é de acesso perfisSistema.ALL
  }, []);

  return (
    <>
      <Row>
        <Col>
          <Card style={{ width: 600 }}></Card>
        </Col>
      </Row>
    </>
  );
}
