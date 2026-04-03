// @ts-check
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import {
  Combobox as HeadlessCombobox,
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
} from '@headlessui/react';
import {
  Combobox as VueHeadlessCombobox,
  Dialog as VueHeadlessDialog,
  DialogPanel as VueHeadlessDialogPanel,
} from '@headlessui/vue';
import {
  AcademicCapIcon as ReactAcademicCapIcon,
  AdjustmentsHorizontalIcon as ReactAdjustmentsHorizontalIcon,
  ArchiveBoxIcon as ReactArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon as VueAcademicCapIcon,
  AdjustmentsHorizontalIcon as VueAdjustmentsHorizontalIcon,
  ArchiveBoxIcon as VueArchiveBoxIcon,
} from '@heroicons/vue/24/outline';
import {
  Root as RadixSlotRoot,
  Slot as RadixSlot,
  Slottable,
} from '@radix-ui/react-slot';
import { configureStore, createAction, createSlice } from '@reduxjs/toolkit';
import {
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query';
import { createGlobalState, useDebounceFn, useThrottleFn } from '@vueuse/core';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import { cva, cx } from 'class-variance-authority';
import { clsx } from 'clsx';
import { group, mean, rollup } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { addDays, formatISO, subWeeks } from 'date-fns';
import dayjs from 'dayjs';
import Dexie, { Entity, liveQuery } from 'dexie';
import { AnimatePresence, DragControls, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { createInstance, dir, getFixedT } from 'i18next';
import { deleteDB, openDB, wrap } from 'idb';
import { createDraft, finishDraft, produce } from 'immer';
import { atom, createStore as createJotaiStore } from 'jotai/vanilla';
import ky, { HTTPError, TimeoutError } from 'ky';
import { LitElement, css, html } from 'lit';
import { camelCase, debounce, uniqBy } from 'lodash-es';
import { Accessibility, Activity, ActivitySquare } from 'lucide-react';
import mitt from 'mitt';
import { makeAutoObservable, observable, reaction } from 'mobx';
import { customAlphabet, nanoid, urlAlphabet } from 'nanoid';
import { createPinia, defineStore, storeToRefs } from 'pinia';
import {
  Component as PreactComponent,
  Fragment as PreactFragment,
  h,
} from 'preact';
import queryString from 'query-string';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { I18nextProvider, Trans, useTranslation } from 'react-i18next';
import {
  Link,
  createBrowserRouter,
  generatePath,
  matchPath,
} from 'react-router-dom';
import {
  add as remedaAdd,
  chunk as remedaChunk,
  clamp as remedaClamp,
} from 'remeda';
import { combineLatest, from, map } from 'rxjs';
import { createEffect, createMemo, createSignal } from 'solid-js';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import useSWR, { mutate as mutateSWR, preload } from 'swr';
import { twJoin, twMerge } from 'tailwind-merge';
import { BoxGeometry, Color, Vector3 } from 'three';
import { proxy, snapshot, subscribe } from 'valtio/vanilla';
import { computed, reactive, watchEffect } from 'vue';
import { createI18n, useI18n, vTDirective } from 'vue-i18n';
import { createRouter, createWebHistory, parseQuery } from 'vue-router';
import { assign, createActor, createMachine } from 'xstate';
import { z } from 'zod';
import { createStore as createZustandStore } from 'zustand/vanilla';

// Keep a small live surface from each package so bundle size mostly reflects
// how well the bundler prunes the rest of the library.
const importedLibraries = {
  '@floating-ui/dom': { computePosition, flip, offset, shift },
  '@headlessui/react': {
    Combobox: HeadlessCombobox,
    Dialog: HeadlessDialog,
    DialogPanel: HeadlessDialogPanel,
  },
  '@headlessui/vue': {
    Combobox: VueHeadlessCombobox,
    Dialog: VueHeadlessDialog,
    DialogPanel: VueHeadlessDialogPanel,
  },
  '@heroicons/react': {
    AcademicCapIcon: ReactAcademicCapIcon,
    AdjustmentsHorizontalIcon: ReactAdjustmentsHorizontalIcon,
    ArchiveBoxIcon: ReactArchiveBoxIcon,
  },
  '@heroicons/vue': {
    AcademicCapIcon: VueAcademicCapIcon,
    AdjustmentsHorizontalIcon: VueAdjustmentsHorizontalIcon,
    ArchiveBoxIcon: VueArchiveBoxIcon,
  },
  '@radix-ui/react-slot': {
    Root: RadixSlotRoot,
    Slot: RadixSlot,
    Slottable,
  },
  '@reduxjs/toolkit': { configureStore, createAction, createSlice },
  '@tanstack/react-query': { HydrationBoundary, QueryClient, useQuery },
  '@vueuse/core': { createGlobalState, useDebounceFn, useThrottleFn },
  axios: { axios, AxiosError, AxiosHeaders },
  'class-variance-authority': { cva, cx },
  clsx: { clsx },
  'd3-array': { group, mean, rollup },
  'd3-scale': { scaleBand, scaleLinear, scaleOrdinal },
  'date-fns': { addDays, formatISO, subWeeks },
  dayjs: { dayjs },
  dexie: { Dexie, Entity, liveQuery },
  'framer-motion': { AnimatePresence, DragControls, motion },
  'fuse.js': { Fuse },
  i18next: { createInstance, dir, getFixedT },
  idb: { deleteDB, openDB, wrap },
  immer: { createDraft, finishDraft, produce },
  jotai: { atom, createStore: createJotaiStore },
  ky: { ky, HTTPError, TimeoutError },
  lit: { LitElement, css, html },
  'lodash-es': { camelCase, debounce, uniqBy },
  'lucide-react': { Accessibility, Activity, ActivitySquare },
  mitt: { mitt },
  mobx: { makeAutoObservable, observable, reaction },
  nanoid: { customAlphabet, nanoid, urlAlphabet },
  pinia: { createPinia, defineStore, storeToRefs },
  preact: {
    Component: PreactComponent,
    Fragment: PreactFragment,
    h,
  },
  'query-string': {
    exclude: queryString.exclude,
    parse: queryString.parse,
    stringify: queryString.stringify,
  },
  'react-hook-form': { Controller, FormProvider, useForm },
  'react-i18next': { I18nextProvider, Trans, useTranslation },
  'react-router-dom': { Link, createBrowserRouter, generatePath, matchPath },
  remeda: { add: remedaAdd, chunk: remedaChunk, clamp: remedaClamp },
  rxjs: { combineLatest, from, map },
  'solid-js': { createEffect, createMemo, createSignal },
  swiper: { Navigation, Pagination, Scrollbar, Swiper },
  swr: { mutate: mutateSWR, preload, useSWR },
  'tailwind-merge': { twJoin, twMerge },
  three: { BoxGeometry, Color, Vector3 },
  valtio: { proxy, snapshot, subscribe },
  vue: { computed, reactive, watchEffect },
  'vue-i18n': { createI18n, useI18n, vTDirective },
  'vue-router': { createRouter, createWebHistory, parseQuery },
  xstate: { assign, createActor, createMachine },
  zod: { z },
  zustand: { createStore: createZustandStore },
};

console.log(importedLibraries);
