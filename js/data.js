// ─────────────────────────────────────────────────
//  DATA.JS — Dados extraídos da planilha
//  calculadora_de_mao_de_obra_e_prazos.xlsx
//  valor = R$ M.O. por unidade
//  tempo = minutos por unidade
// ─────────────────────────────────────────────────

const DEFAULT_DATA = {
  sistemas: {
    cftv: {
      label: 'CFTV',
      items: [
        { id:'cam_vhci',    nome:'CAMERA VHCI',           unidade:'PEÇA',   valor:220,  tempo:60   },
        { id:'cam_ip',      nome:'CAMERA IP',             unidade:'PEÇA',   valor:220,  tempo:60   },
        { id:'cam_ptz',     nome:'CAMERA PTZ',            unidade:'PEÇA',   valor:600,  tempo:360  },
        { id:'cam_elev',    nome:'CAMERA ELEVADORES',     unidade:'PEÇA',   valor:300,  tempo:180  },
        { id:'cam_repos',   nome:'REPOSICIONAMENTO CAM',  unidade:'PEÇA',   valor:170,  tempo:60   },
        { id:'switch',      nome:'SWITCH',                unidade:'PEÇA',   valor:120,  tempo:60   },
        { id:'dvr',         nome:'DVR',                   unidade:'PEÇA',   valor:100,  tempo:60   },
        { id:'mini_rack',   nome:'MINI RACK',             unidade:'PEÇA',   valor:250,  tempo:60   },
        { id:'rack_9_16',   nome:'RACK 9U A 16U',         unidade:'PEÇA',   valor:400,  tempo:120  },
        { id:'rack_17_44',  nome:'RACK 17U A 44U',        unidade:'PEÇA',   valor:600,  tempo:300  },
        { id:'monitor',     nome:'MONITOR 32+',           unidade:'PEÇA',   valor:120,  tempo:90   },
        { id:'nobreak',     nome:'NOBREAK',               unidade:'PEÇA',   valor:80,   tempo:40   },
        { id:'computador',  nome:'COMPUTADOR',            unidade:'PEÇA',   valor:180,  tempo:90   },
        { id:'power_balun', nome:'POWER BALUN',           unidade:'PEÇA',   valor:40,   tempo:60   },
        { id:'eletroduto',  nome:'ELETRODUTO',            unidade:'METRO',  valor:15,   tempo:30   },
        { id:'perfilado',   nome:'PERFILADO',             unidade:'METRO',  valor:25,   tempo:0    },
        { id:'fusao_fibra', nome:'FUSÃO DE FIBRA',        unidade:'PEÇA',   valor:100,  tempo:60   },
        { id:'poste_6m',    nome:'POSTE ATÉ 6MT',         unidade:'PEÇA',   valor:400,  tempo:360  },
        { id:'quadro_cmd',  nome:'QUADRO DE COMANDO',     unidade:'METRO',  valor:350,  tempo:181  },
      ]
    },
    ctca: {
      label: 'Controle de Acesso',
      items: [
        { id:'ctrl_facial',  nome:'CONTROLADORA FACIAL',        unidade:'PEÇA',  valor:500,  tempo:180  },
        { id:'mola_aerea',   nome:'MOLA AÉREA',                 unidade:'PEÇA',  valor:50,   tempo:60   },
        { id:'botao_saida',  nome:'BOTÃO SAÍDA',                unidade:'PEÇA',  valor:40,   tempo:30   },
        { id:'fonte_int',    nome:'FONTE ININTERRUPTA',         unidade:'PEÇA',  valor:80,   tempo:60   },
        { id:'fech_eletro',  nome:'FECHADURA ELETROMAGNÉTICA',  unidade:'PEÇA',  valor:100,  tempo:60   },
        { id:'acion_emerg',  nome:'ACIONADOR EMERGÊNCIA',       unidade:'PEÇA',  valor:40,   tempo:30   },
        { id:'puxe_emp',     nome:'PUXE / EMPURRE',             unidade:'PEÇA',  valor:40,   tempo:30   },
        { id:'interfone',    nome:'INTERFONE / INTERCOMUNICADOR',unidade:'PEÇA', valor:250,  tempo:60   },
        { id:'antena_veic',  nome:'ANTENA VEICULAR',            unidade:'PEÇA',  valor:500,  tempo:180  },
        { id:'laco_indut',   nome:'LAÇO INDUTIVO',              unidade:'PEÇA',  valor:800,  tempo:300  },
        { id:'mod_guarita',  nome:'MÓDULO GUARITA',             unidade:'PEÇA',  valor:300,  tempo:60   },
        { id:'catraca',      nome:'CATRACA',                    unidade:'PEÇA',  valor:1000, tempo:480  },
        { id:'cancela',      nome:'CANCELA',                    unidade:'PEÇA',  valor:1000, tempo:480  },
        { id:'base_cancela', nome:'BASE CANCELA',               unidade:'PEÇA',  valor:600,  tempo:300  },
        { id:'torniquete',   nome:'TORNIQUETE',                 unidade:'PEÇA',  valor:1000, tempo:720  },
        { id:'comp_ctca',    nome:'COMPUTADOR',                 unidade:'PEÇA',  valor:300,  tempo:60   },
        { id:'monitor_ctca', nome:'MONITOR',                    unidade:'PEÇA',  valor:50,   tempo:30   },
        { id:'nobreak_ctca', nome:'NOBREAK',                    unidade:'PEÇA',  valor:50,   tempo:30   },
        { id:'elet_ctca',    nome:'ELETRODUTO',                 unidade:'METRO', valor:15,   tempo:30   },
        { id:'perf_ctca',    nome:'PERFILADO',                  unidade:'METRO', valor:25,   tempo:0    },
        { id:'eletroc_ctca', nome:'ELETROCALHA',                unidade:'METRO', valor:35,   tempo:0    },
        { id:'poste_ctca',   nome:'POSTE',                      unidade:'PEÇA',  valor:400,  tempo:360  },
        { id:'quadro_ctca',  nome:'QUADRO DE COMANDO',          unidade:'METRO', valor:500,  tempo:185  },
      ]
    },
    alar: {
      label: 'Alarme',
      items: [
        { id:'c10_sf',  nome:'CENTRAL ALARME ATÉ 10 SENSORES SEM FIO', unidade:'PEÇA',  valor:350,  tempo:240  },
        { id:'c20_sf',  nome:'CENTRAL ALARME ATÉ 20 SENSORES SEM FIO', unidade:'PEÇA',  valor:650,  tempo:480  },
        { id:'c10_cf',  nome:'CENTRAL ALARME ATÉ 10 SENSORES COM FIO', unidade:'PEÇA',  valor:650,  tempo:360  },
        { id:'c20_cf',  nome:'CENTRAL ALARME ATÉ 20 SENSORES COM FIO', unidade:'PEÇA',  valor:1000, tempo:720  },
        { id:'iva_cf',  nome:'IVA COM FIO',                            unidade:'PEÇA',  valor:150,  tempo:60   },
        { id:'iva_sf',  nome:'IVA SEM FIO',                            unidade:'PEÇA',  valor:100,  tempo:30   },
        { id:'pto_el',  nome:'PONTO ELÉTRICO',                         unidade:'PEÇA',  valor:80,   tempo:60   },
        { id:'elet_al', nome:'ELETRODUTO',                             unidade:'METRO', valor:15,   tempo:30   },
        { id:'perf_al', nome:'PERFILADO',                              unidade:'METRO', valor:25,   tempo:0    },
        { id:'elec_al', nome:'ELETROCALHA',                            unidade:'METRO', valor:35,   tempo:0    },
        { id:'post_al', nome:'POSTE',                                  unidade:'PEÇA',  valor:400,  tempo:360  },
        { id:'qdr_al',  nome:'QUADRO DE COMANDO',                      unidade:'METRO', valor:200,  tempo:185  },
      ]
    },
    peri: {
      label: 'Perimetral',
      items: [
        { id:'cerca',    nome:'CERCA ELÉTRICA',    unidade:'METRO', valor:18,  tempo:65   },
        { id:'ctrl_cho', nome:'CENTRAL CHOQUE',    unidade:'PEÇA',  valor:300, tempo:60   },
        { id:'elet_pe',  nome:'ELETRODUTO',         unidade:'METRO', valor:15,  tempo:30   },
        { id:'perf_pe',  nome:'PERFILADO',          unidade:'METRO', valor:25,  tempo:0    },
        { id:'elec_pe',  nome:'ELETROCALHA',        unidade:'METRO', valor:35,  tempo:0    },
        { id:'post_pe',  nome:'POSTE',              unidade:'PEÇA',  valor:400, tempo:360  },
        { id:'qdr_pe',   nome:'QUADRO DE COMANDO',  unidade:'METRO', valor:200, tempo:185  },
      ]
    },
    serr: {
      label: 'Serralheria',
      items: [
        { id:'serralheria', nome:'SERRALHERIA', unidade:'DIARIA', valor:0, tempo:5 },
      ]
    },
    viagem: {
      label: 'Custos de Viagem',
      items: [
        { id:'diaria_tec', nome:'DIÁRIA TÉCNICA',  unidade:'DIARIA', valor:650,  tempo:0 },
        { id:'deslocam',   nome:'DESLOCAMENTO',    unidade:'KM',     valor:1.20, tempo:0 },
        { id:'hospedagem', nome:'HOSPEDAGEM',      unidade:'DIARIA', valor:50,   tempo:0 },
        { id:'visita_tec', nome:'VISITA TÉCNICA',  unidade:'DIARIA', valor:350,  tempo:0 },
      ]
    },
  }
};
