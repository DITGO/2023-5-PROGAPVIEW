'use client';
import { AuthProvider, useAuth } from '@/contexts/auth/AuthProvider';
import '../globals.css';

import { Inter } from 'next/font/google';
import ptBR from 'antd/es/locale/pt_BR';
import {
  DesktopOutlined,
  FolderOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LoadingOutlined,
  PoundOutlined,
  PoweroffOutlined,
  QuestionCircleFilled,
  FileTextOutlined,
  ReadOutlined,
  StarFilled,
  GiftOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  perfisSistema,
  sistemaDescricao,
  sistemaNameSSO,
  sistemaVersao,
} from '@/configs/sistemaConfig';
import Title from 'antd/es/typography/Title';
import Link from 'next/link';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  ConfigProvider,
  Divider,
  Drawer,
  Layout,
  List,
  Menu,
  MenuProps,
  Modal,
  Popover,
  Result,
  Row,
  Space,
  Tooltip,
  theme,
} from 'antd';
import { removeParameterUrl } from '@/utils/UtilsSistema';
import { urlsServices } from '@/configs/urlsConfig';
const inter = Inter({ subsets: ['latin'] });
const { Header, Content, Footer, Sider } = Layout;

export default function RootLayout({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [unidades, setUnidades] = useState([{ nome: '', codigo: 0 }]);
  const [openModalUnidade, setOpenModalUnidade] = useState(false);
  const [unidade, setUnidade] = useState<{
    nome: string;
    codigo: number;
  } | null>(null);
  const [itemsMenu, setItemsMenu] = useState<MenuItem[]>([]);
  const [migalhas, setMigalhas] = useState<[{ title: string }]>([
    { title: '' },
  ]);
  const [openKeys, setOpenKeys] = useState(['dashboard']);
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState<string[]>([]);

  const [visibleSensive, setVisibleSensive] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  type MenuItem = Required<MenuProps>['items'][number];

  const menus = [
    {
      label: 'Dashboard',
      key: 'dashboard',
      icon: <DesktopOutlined />,
      link: '/dashboard',
      perfis: [perfisSistema.ALL],
      children: [],
    },
    {
      label: 'Recursos',
      key: 'resources',
      icon: <FolderOutlined />,
      link: '/resources',
      perfis: [perfisSistema.ALL],
      children: [],
    },
    {
      label: 'Eixos',
      key: 'axles',
      icon: <PoundOutlined />,
      link: '/axles',
      perfis: [perfisSistema.ALL],
      children: [],
    },
    {
      label: 'Objetos',
      key: 'objects',
      icon: <GiftOutlined />,
      link: '/objects',
      perfis: [perfisSistema.ALL],
      children: [],
    },
    {
      label: 'Modelo',
      key: 'model',
      icon: <FileTextOutlined />,
      link: '/model',
      perfis: [perfisSistema.ALL],
      children: [],
    },
    {
      label: 'Natureza',
      key: 'nature',
      icon: <ReadOutlined />,
      link: '/nature',
      perfis: [perfisSistema.ALL],
      children: [],
    },
  ];

  const getItem = (
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
    perfis?: string[],
  ) => {
    return {
      key,
      icon,
      children,
      label,
      type,
      perfis,
    } as MenuItem;
  };

  const atualizaMigalhas = (e: any) => {
    console.log(e);
    const path = e.keyPath.reverse(); //window.location.pathname.split('/');
    const breacrumpP: any = [];
    path.map((item: string) => {
      if (item != '') {
        const str = item[0].toUpperCase() + item.substring(1);
        breacrumpP.push({ title: str });
      }
    });
    setMigalhas(breacrumpP);
  };

  const MontaMenu = () => {
    const items: MenuItem[] = [];
    const rootMenu: string[] = [];
    menus.map(menu => {
      //loop para ver se o perfil do usuario tem permissão para o menu
      let autorizado = false;
      if (auth?.user?.perfisSistemaAtual?.includes('ADM')) {
        autorizado = true;
      } else if (menu.perfis.includes('QUALQUER_PERFIL')) {
        autorizado = true;
      } else {
        auth?.user?.perfisSistemaAtual?.map((perfil: any) => {
          menu.perfis.map(menuPerf => {
            if (perfil == menuPerf) {
              autorizado = true;
            }
          });
        });
      }

      if (autorizado) {
        const itemsChildren: MenuItem[] = [];
        if (menu.children.length > 0) {
          const menuChildren: MenuItem[] = [];
          menu.children.map((child: any) => {
            const label = <Link href={child.link}>{child.label}</Link>;
            menuChildren.push(getItem(label, child.key, child.icon));
          });
          items.push(getItem(menu.label, menu.key, menu.icon, menuChildren));
        } else {
          const label = <Link href={menu.link}>{menu.label}</Link>;
          items.push(getItem(label, menu.key, menu.icon));
        }
        rootMenu.push(menu.key);
      }
    });
    setRootSubmenuKeys(rootMenu);
    setItemsMenu(items);
  };

  const getUnidades = () => {
    const unidadex = auth?.user?.unidade;
    const unidadesx = auth?.user?.unidadesDeTrabalho;
    const unidadeN: any = [];
    unidadeN.push({ nome: unidadex?.nome, codigo: unidadex?.id });
    unidadesx?.map(item => {
      if (unidadex?.id != item.unidadeId) {
        unidadeN.push({ nome: item.unidadeNome, codigo: item.unidadeId });
      }
    });

    setUnidades(unidadeN);

    if (
      !localStorage.getItem('localId') &&
      localStorage.getItem('localId') == '' &&
      localStorage.getItem('localId') == undefined
    ) {
      localStorage.setItem('localId', unidades[0].codigo.toString());
      localStorage.setItem('localNome', unidades[0].nome);
      setUnidade(unidades[0]);
    } else {
      setUnidade({
        nome: localStorage.getItem('localNome')!,
        codigo: parseInt(localStorage.getItem('localId')!),
      });
    }
  };

  const openModalSelectUnidade = () => {
    setOpenModalUnidade(true);
  };

  const onCloseSelectUnidade = () => {
    setOpenModalUnidade(false);
  };

  const setUnidadeClick = (unidade: { nome: string; codigo: number }) => {
    localStorage.setItem('localId', unidade.codigo.toString());
    localStorage.setItem('localNome', unidade.nome);
    setUnidade(unidade);
    setOpenModalUnidade(false);
  };

  const redirect = () => {
    window.location.href = `${
      urlsServices.SSOWS
    }auth?response_type=token_only&client_id=${sistemaNameSSO}&redirect_uri=${encodeURIComponent(
      window.location.href.replace('#', '|').split('/?access_token')[0],
    )}`;
  };

  const actionDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  useEffect(() => {
    getUnidades();
    MontaMenu();
    removeParameterUrl('access_token');
    setMigalhas([{ title: 'Dashboard' }]);
  }, [auth]);

  return (
    <>
      {auth?.validado ? (
        <ConfigProvider locale={ptBR}>
          <Layout style={{ height: '100vh', width: '100%' }}>
            <Sider
              collapsible
              breakpoint="lg"
              onBreakpoint={broken => {
                console.log(broken);
              }}
              collapsed={collapsed}
              onCollapse={value => setCollapsed(value)}
              style={{ backgroundColor: colorBgContainer, height: '100%' }}
            >
              <div className="logo" />
              <Row
                style={{
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '6px',
                  marginBottom: '16px',
                }}
              >
                PCGO
              </Row>
              <Menu
                onClick={atualizaMigalhas}
                theme="light"
                mode="inline"
                defaultSelectedKeys={openKeys}
                defaultOpenKeys={openKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={itemsMenu}
                style={{ height: '83.5%' }}
              />
            </Sider>
            <Layout style={{ width: '100%' }}>
              <Header
                style={{
                  padding: 5,
                  background: colorBgContainer,
                  borderRadius: '0px 0px 10px 10px',
                  marginInline: 10,
                }}
              >
                <Row
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    padding: 5,
                  }}
                >
                  <Col span={6}>
                    <Row>
                      <Title
                        style={{
                          fontSize: 24,
                          marginTop: -15,
                          fontWeight: 700,
                        }}
                      >
                        {sistemaNameSSO}
                      </Title>
                    </Row>
                    <Row
                      style={{
                        fontSize: 14,
                        color: '#00000080',
                        marginTop: -10,
                      }}
                    >
                      {sistemaDescricao}
                    </Row>
                  </Col>
                  <Col span={10}>
                    <Row
                      style={{
                        fontSize: 14,
                        color: '#00000080',
                        paddingLeft: 15,
                      }}
                    >
                      Unidade&nbsp;
                      <Popover title="Clique no nome abaixo para trocar de unidade.">
                        <QuestionCircleFilled />
                      </Popover>
                    </Row>
                    <Row>
                      <Title style={{ fontSize: 18 }}>
                        <Button
                          style={{ color: '#000000', fontWeight: 600 }}
                          type="link"
                          onClick={() => openModalSelectUnidade()}
                        >
                          {unidade?.nome}
                        </Button>
                      </Title>
                    </Row>
                  </Col>
                  <Col
                    span={8}
                    style={{ display: 'flex', justifyContent: 'right' }}
                  >
                    <Space>
                      <Avatar
                        src={auth?.user?.icon}
                        style={{ marginRight: 5, marginTop: '-10px' }}
                      >
                        {auth?.user?.nome} - {auth?.user?.funcao}
                      </Avatar>
                      <Col>
                        <Row onClick={() => actionDrawer()} className="click">
                          <strong style={{ marginRight: 5 }}>
                            {auth?.user?.nome}
                          </strong>
                        </Row>
                        {visibleSensive ? (
                          <Row>
                            <Col style={{ fontSize: 12, color: '#00000080' }}>
                              {auth?.user?.cpf} - {auth?.user?.funcao}
                            </Col>
                            <Col style={{ marginTop: -2, paddingLeft: 5 }}>
                              <EyeInvisibleOutlined
                                onClick={() =>
                                  setVisibleSensive(!visibleSensive)
                                }
                                className="click"
                              />
                            </Col>
                          </Row>
                        ) : (
                          <Row>
                            <Col style={{ fontSize: 12, color: '#00000080' }}>
                              *********** - ****************
                            </Col>
                            <Col style={{ marginTop: -2, paddingLeft: 5 }}>
                              <EyeOutlined
                                onClick={() =>
                                  setVisibleSensive(!visibleSensive)
                                }
                                className="click"
                              />
                            </Col>
                          </Row>
                        )}
                      </Col>
                      <Button
                        shape="circle"
                        icon={
                          <PoweroffOutlined
                            style={{ color: 'white' }}
                            title={'Sair'}
                          />
                        }
                        onClick={auth?.logoutSSO}
                      />
                    </Space>
                  </Col>
                </Row>
              </Header>
              <Content
                style={{
                  margin: '5px',
                  backgroundColor: colorBgContainer,
                  overflowY: 'auto',
                  borderRadius: '10px 10px 0px 0px',
                  padding: 10,
                }}
              >
                <Breadcrumb style={{ margin: '16px 0' }} items={migalhas!} />
                <AuthProvider>{children}</AuthProvider>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                {sistemaNameSSO} ©2023 Divisão de Inovação e Tecnologia
              </Footer>
            </Layout>
          </Layout>
          <Modal
            title={'Escolha uma unidade'}
            open={openModalUnidade}
            footer
            width={600}
            onCancel={onCloseSelectUnidade}
          >
            <List>
              {unidades.map((item, index) => {
                return (
                  <List.Item key={index} className="star">
                    <Button
                      type="link"
                      onClick={() => setUnidadeClick(item)}
                      style={{ color: '#000000' }}
                    >
                      <StarFilled />
                      {item.nome}
                    </Button>
                  </List.Item>
                );
              })}
            </List>
          </Modal>
          <Drawer
            title="Dados do Usuário"
            placement="right"
            onClose={actionDrawer}
            open={openDrawer}
          >
            <p style={{ fontSize: 18, fontWeight: 700 }}>{auth.user?.nome}</p>
            <p>
              {auth.user?.corporacaoAtual
                ? auth.user?.corporacaoAtual.nome
                : ''}{' '}
              - {auth.user?.funcao}
            </p>
            <Divider>Unidades</Divider>
            <p>Unidade:</p>
            <p>{auth.user?.unidade.nome}</p>
            <Divider />
            <p>Unidades de Trabalho:</p>
            <p>&nbsp;</p>
            {auth.user?.unidadesDeTrabalho.map(unidade => {
              // eslint-disable-next-line react/jsx-key
              return <p>- {unidade.unidadeNome}</p>;
            })}
            <Divider>Sistemas</Divider>
            <p>
              <strong>Sistema / Perfil</strong>
            </p>
            <p>&nbsp;</p>
            {auth.user?.perfis.map(perfil => {
              let sistema: JSX.Element | null = null;
              if (perfil.sistema.descricao == sistemaNameSSO) {
                sistema = (
                  <p>
                    <strong>
                      {perfil.sistema.descricao.toUpperCase()} /{' '}
                      {perfil.descricao}
                    </strong>
                  </p>
                );
              } else {
                sistema = (
                  <p>
                    {perfil.sistema.descricao.toUpperCase()} /{' '}
                    {perfil.descricao}
                  </p>
                );
              }
              return sistema;
            })}
          </Drawer>
        </ConfigProvider>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Result
            icon={<LoadingOutlined />}
            title="Validando seus dados!"
            subTitle="Aguarde, você será redirecionado..."
            style={{ marginTop: '15%' }}
            extra={
              <Button type="link" onClick={() => redirect()}>
                Clique aqui se não for redirecionado!
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
