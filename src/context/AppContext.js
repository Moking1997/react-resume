import React, { createContext, useReducer } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import remove from 'lodash/remove';

import demoData from '../assets/demo/data.json';
import { move } from '../utils';

const initialState = {
  data: {
    profile: {
      heading: '基本信息',
      photo: '',
      firstName: '',
      lastName: '',
      subtitle: '',
      address: {
        line1: '',
        line2: '',
        line3: '',
      },
      phone: '',
      website: '',
      email: '',
    },
    objective: {
      enable: true,
      heading: '职位意向',
      body: '',
    },
    work: {
      enable: true,
      heading: '工作经历',
      items: [],
    },
    education: {
      enable: true,
      heading: '教育经历',
      items: [],
    },
    awards: {
      enable: true,
      heading: '荣誉奖章',
      items: [],
    },
    certifications: {
      enable: true,
      heading: '证书',
      items: [],
    },
    skills: {
      enable: true,
      heading: '专业技能',
      items: [],
    },
    hobbies: {
      enable: true,
      heading: '兴趣爱好',
      items: [],
    },
    languages: {
      enable: true,
      heading: '语言能力',
      items: [],
    },
    references: {
      enable: true,
      heading: '推荐人',
      items: [],
    },
    extras: {
      enable: true,
      heading: '其他信息',
      items: [],
    },
  },
  theme: {
    layout: 'Onyx',
    font: {
      family: '',
    },
    colors: {
      background: '#ffffff',
      primary: '#212121',
      accent: '#009688',
    },
  },
  settings: {
    language: 'zh',
  },
};

const reducer = (state, { type, payload }) => {
  let items;
  const newState = JSON.parse(JSON.stringify(state));

  switch (type) {
    case 'migrate_section':
      return set({ ...newState }, `data.${payload.key}`, payload.value);
    case 'add_item':
      items = get({ ...newState }, `data.${payload.key}.items`, []);
      items.push(payload.value);
      return set({ ...newState }, `data.${payload.key}.items`, items);
    case 'delete_item':
      items = get({ ...newState }, `data.${payload.key}.items`, []);
      remove(items, x => x.id === payload.value.id);
      return set({ ...newState }, `data.${payload.key}.items`, items);
    case 'move_item_up':
      items = get({ ...newState }, `data.${payload.key}.items`, []);
      move(items, payload.value, -1);
      return set({ ...newState }, `data.${payload.key}.items`, items);
    case 'move_item_down':
      items = get({ ...newState }, `data.${payload.key}.items`, []);
      move(items, payload.value, 1);
      return set({ ...newState }, `data.${payload.key}.items`, items);
    case 'on_input':
      return set({ ...newState }, payload.key, payload.value);
    case 'save_data':
      localStorage.setItem('state', JSON.stringify(newState));
      return newState;
    case 'import_data':
      if (payload === null) return initialState;

      for (const section of Object.keys(initialState.data)) {
        if (!(section in payload.data)) {
          payload.data[section] = initialState.data[section];
        }
      }

      return {
        ...newState,
        ...payload,
      };
    case 'load_demo_data':
      return {
        ...newState,
        ...demoData,
      };
    case 'reset':
      return initialState;
    default:
      return newState;
  }
};

const AppContext = createContext(initialState);
const { Provider } = AppContext;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export const AppProvider = StateProvider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;
