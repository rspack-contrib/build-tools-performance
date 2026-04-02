// @ts-check
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { configureStore, createAction, createSlice } from '@reduxjs/toolkit';
import {
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';
import {
  createGlobalState,
  useDebounceFn,
  useThrottleFn,
} from '@vueuse/core';
import { group, mean, rollup } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { addDays, formatISO, subWeeks } from 'date-fns';
import { atom, createStore as createJotaiStore } from 'jotai/vanilla';
import { camelCase, debounce, uniqBy } from 'lodash-es';
import { makeAutoObservable, observable, reaction } from 'mobx';
import { customAlphabet, nanoid, urlAlphabet } from 'nanoid';
import { createPinia, defineStore, storeToRefs } from 'pinia';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Link,
  createBrowserRouter,
  generatePath,
  matchPath,
} from 'react-router-dom';
import { combineLatest, from, map } from 'rxjs';
import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { computed, reactive, watchEffect } from 'vue';
import { createRouter, createWebHistory, parseQuery } from 'vue-router';
import { z } from 'zod';
import { createStore as createZustandStore } from 'zustand/vanilla';

// Keep a small live surface from each package so bundle size mostly reflects
// how well the bundler prunes the rest of the library.
const importedLibraries = {
  '@floating-ui/dom': { computePosition, flip, offset, shift },
  '@reduxjs/toolkit': { configureStore, createAction, createSlice },
  '@tanstack/react-query': { HydrationBoundary, QueryClient, useQuery },
  '@vueuse/core': { createGlobalState, useDebounceFn, useThrottleFn },
  'd3-array': { group, mean, rollup },
  'd3-scale': { scaleBand, scaleLinear, scaleOrdinal },
  'date-fns': { addDays, formatISO, subWeeks },
  jotai: { atom, createStore: createJotaiStore },
  'lodash-es': { camelCase, debounce, uniqBy },
  mobx: { makeAutoObservable, observable, reaction },
  nanoid: { customAlphabet, nanoid, urlAlphabet },
  pinia: { createPinia, defineStore, storeToRefs },
  'react-hook-form': { Controller, FormProvider, useForm },
  'react-router-dom': { Link, createBrowserRouter, generatePath, matchPath },
  rxjs: { combineLatest, from, map },
  valtio: { proxy, snapshot, subscribe },
  vue: { computed, reactive, watchEffect },
  'vue-router': { createRouter, createWebHistory, parseQuery },
  zod: { z },
  zustand: { createStore: createZustandStore },
};

console.log(importedLibraries);
