<script setup lang="jsx">
import { ref, inject, computed, onMounted, onBeforeUnmount } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { getObjField } from '@/service/ObjectMethods';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const helpdesk = inject('helpdesk');

const props = defineProps({
  columns: {
    type: Array,
    default: []
  },
  globalFilter: {
    type: [Object, Boolean],
    default: false
  },
  storageKey: {
    type: String,
    default: 'datatable-config'
  },
  exportFileName: {
    type: String,
    default: 'datatable-export'
  },
  onUpdate: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
});

const emits = defineEmits(['toggleMenu', 'toggleModal', 'toggleSidebar']);

defineExpose({
  update: async ({ filters }) => {
    if (filters) {
      params.value.filters = { ...params.value.filters, ...filters };
    }
    await onUpdateRecords();
  },
  delete: async data => {
    await onRemoveRecord(data);
  }
});

const onOptionsMenu = (event, value) => {
  emits('toggleMenu', event, value);
};

const screenSize = ref('');

const refDataTable = ref();
const keyDataTable = ref(0);
const refMenuColumns = ref();

const cols = ref([]);
const params = ref({});
const filters = ref({});
const records = ref([]);
const loading = ref(false);
const totalRecords = ref();
const offsetRecords = ref(0);
const recordsPerPage = ref(15);
const recordsPerPageOptions = ref([5, 10, 15, 20, 25, 50]);

const dataTableStyle = ref({
  // root: ({ props }) => ({
  //   class: [
  //     'relative',
  //     'min-w-full',
  //     'overflow-x-auto',
  //     // 'bg-surface-0 dark:bg-surface-900',
  //     // Flex & Alignment
  //     { 'flex flex-col': props.scrollable && props.scrollHeight === 'flex' },
  //     // Size
  //     { 'h-full': props.scrollable && props.scrollHeight === 'flex' }
  //   ]
  // })
  // loadingoverlay: {
  //   class: [
  //     'absolute',
  //     'top-0 left-0',
  //     'z-20',
  //     'flex items-center justify-center',
  //     'w-full h-full',
  //     'bg-transparent', // 'bg-surface-100/40 dark:bg-surface-800/40',
  //     'transition duration-200'
  //   ]
  // }
  // header: ({ props }) => ({
  //   class: [
  //     'font-bold',
  //     // Shape
  //     props.showGridlines ? 'border-x border-t border-b-0' : 'border-0', // 'border-y border-x-0',
  //     // Spacing
  //     'px-0 py-2', // 'p-4',
  //     // Color
  //     'bg-surface-10 dark:bg-surface-900',
  //     'border-surface-200 dark:border-surface-700',
  //     'text-surface-700 dark:text-white/80'
  //   ]
  // })
  // thead: ({ context }) => ({
  //   class: [
  //     {
  //       'bg-surface-0 dark:bg-surface-900 top-0 z-40 sticky': context.scrollable
  //     }
  //   ]
  // })
  // column: {
  //   headercell: ({ context, props }) => ({
  //     class: [
  //       'font-bold',
  //       // Position
  //       { 'sticky z-20 border-b': props.frozen || props.frozen === '' },
  //       { relative: context.resizable },
  //       // Alignment
  //       'text-left',
  //       // Shape
  //       {
  //         'first:border-l border-y border-r': context == null ? void 0 : context.showGridlines
  //       },
  //       'border-0 border-b border-solid',
  //       // Spacing
  //       (context == null ? void 0 : context.size) === 'small'
  //         ? 'p-2'
  //         : (context == null ? void 0 : context.size) === 'large'
  //         ? 'p-5'
  //         : 'p-4',
  //       // Color
  //       // (props.sortable === '' || props.sortable) && context.sorted
  //       //   ? 'bg-primary-50 text-primary-700'
  //       //   : 'bg-surface-50 text-surface-700',
  //       (props.sortable === '' || props.sortable) && context.sorted
  //         ? 'text-primary-700'
  //         : 'text-surface-700',
  //       // (props.sortable === '' || props.sortable) && context.sorted
  //       //   ? 'dark:text-white dark:bg-primary-400/30'
  //       //   : 'dark:text-white/80 dark:bg-surface-800',
  //       (props.sortable === '' || props.sortable) && context.sorted
  //         ? 'dark:text-white'
  //         : 'dark:text-white/80',
  //       'border-surface-200 dark:border-surface-700 ',
  //       // States
  //       // {
  //       //   'hover:bg-surface-100 dark:hover:bg-surface-400/30':
  //       //     (props.sortable === '' || props.sortable) && !(context != null && context.sorted)
  //       // },
  //       'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
  //       // Transition
  //       { 'transition duration-200': props.sortable === '' || props.sortable },
  //       // Misc
  //       { 'cursor-pointer': props.sortable === '' || props.sortable },
  //       {
  //         'overflow-hidden space-nowrap border-y bg-clip-padding': context.resizable
  //         // Resizable
  //       }
  //     ]
  //   }),
  //   headercontent: {
  //     class: 'flex items-center'
  //   },
  //   sort: ({ context }) => ({
  //     class: [
  //       context.sorted ? 'text-primary-500' : 'text-surface-700',
  //       context.sorted ? 'dark:text-primary-400' : 'dark:text-white/80'
  //     ]
  //   }),
  //   bodycell: ({ props, context, state, parent }) => ({
  //     class: [
  //       //Position
  //       { 'sticky box-border border-b': parent.instance.frozenRow },
  //       { 'sticky box-border border-b': props.frozen || props.frozen === '' },
  //       // Alignment
  //       'text-left',
  //       // Shape
  //       'border-0 border-b border-solid',
  //       {
  //         'first:border-l border-r border-b': context == null ? void 0 : context.showGridlines
  //       },
  //       {
  //         'bg-surface-0 dark:bg-surface-900':
  //           parent.instance.frozenRow || props.frozen || props.frozen === ''
  //       },
  //       // Spacing
  //       {
  //         'p-2': (context == null ? void 0 : context.size) === 'small' && !state.d_editing
  //       },
  //       {
  //         'p-5': (context == null ? void 0 : context.size) === 'large' && !state.d_editing
  //       },
  //       {
  //         'p-4':
  //           (context == null ? void 0 : context.size) !== 'large' &&
  //           (context == null ? void 0 : context.size) !== 'small' &&
  //           !state.d_editing
  //       },
  //       { 'py-[0.6rem] px-2': state.d_editing },
  //       // Color
  //       'border-surface-200 dark:border-surface-700'
  //     ]
  //   }),
  //   footercell: ({ context }) => ({
  //     class: [
  //       // Font
  //       'font-bold',
  //       // Alignment
  //       'text-left',
  //       // Shape
  //       'border-0 border-b border-solid',
  //       {
  //         'border-x border-y': context == null ? void 0 : context.showGridlines
  //       },
  //       // Spacing
  //       (context == null ? void 0 : context.size) === 'small'
  //         ? 'p-2'
  //         : (context == null ? void 0 : context.size) === 'large'
  //         ? 'p-5'
  //         : 'p-4',
  //       // Color
  //       'border-surface-200 dark:border-surface-700',
  //       'text-surface-700 dark:text-white/80',
  //       'bg-surface-50 dark:bg-surface-800'
  //     ]
  //   }),
  //   sorticon: ({ context }) => ({
  //     class: [
  //       'ml-2',
  //       context.sorted
  //         ? 'text-primary-700 dark:text-white/80'
  //         : 'text-surface-700 dark:text-white/70'
  //     ]
  //   }),
  //   sortbadge: {
  //     class: [
  //       'flex items-center justify-center align-middle',
  //       'rounded-full',
  //       'w-[1.143rem] leading-[1.143rem]',
  //       'ml-2',
  //       'text-primary-700 dark:text-white',
  //       'bg-primary-50 dark:bg-primary-400/30'
  //     ]
  //   },
  //   columnfilter: {
  //     class: 'inline-flex items-center ml-auto'
  //   },
  //   filteroverlay: {
  //     class: [
  //       'absolute top-0 left-0',
  //       'border-0 dark:border',
  //       'rounded-md',
  //       'shadow-md',
  //       'min-w-[12.5rem]',
  //       'bg-surface-0 dark:bg-surface-800',
  //       'text-surface-800 dark:text-white/80',
  //       'dark:border-surface-700'
  //     ]
  //   },
  //   filtermatchmodedropdown: {
  //     root: ({ state }) => ({
  //       class: [
  //         // Display and Position
  //         'flex',
  //         'relative',
  //         // Spacing
  //         'my-2',
  //         // Shape
  //         'w-full',
  //         'rounded-md',
  //         // Color and Background
  //         'bg-surface-0 dark:bg-surface-900',
  //         'border border-surface-300 dark:border-surface-700',
  //         'text-surface-800 dark:text-white/80',
  //         'placeholder:text-surface-400 dark:placeholder:text-surface-500',
  //         // Transitions
  //         'transition-all',
  //         'duration-200',
  //         // States
  //         'hover:border-primary-500 dark:hover:border-primary-300',
  //         {
  //           'outline-none outline-offset-0 ring ring-primary-400/50 dark:ring-primary-300/50':
  //             state.focused
  //         },
  //         // Misc
  //         'cursor-pointer',
  //         'select-none'
  //       ]
  //     })
  //   },
  //   filterrowitems: {
  //     class: 'm-0 p-0 py-3 list-none'
  //   },
  //   filterrowitem: ({ context }) => ({
  //     class: [
  //       // Font
  //       'font-normal',
  //       'leading-none',
  //       // Position
  //       'relative',
  //       // Shape
  //       'border-0',
  //       'rounded-none',
  //       // Spacing
  //       'm-0',
  //       'py-3 px-5',
  //       // Color
  //       {
  //         'text-surface-700 dark:text-white/80': !(context != null && context.highlighted)
  //       },
  //       {
  //         'bg-surface-0 dark:bg-surface-800 text-surface-700 dark:text-white/80': !(
  //           context != null && context.highlighted
  //         )
  //       },
  //       {
  //         'bg-primary-100 dark:bg-primary-400/40 text-primary-700 dark:text-white/80':
  //           context == null ? void 0 : context.highlighted
  //       },
  //       {
  //         'bg-primary-50 dark:bg-primary-400/40 text-primary-700 dark:text-white/80':
  //           context == null ? void 0 : context.highlighted
  //       },
  //       //States
  //       {
  //         'hover:bg-surface-100 dark:hover:bg-surface-600/80': !(
  //           context != null && context.highlighted
  //         )
  //       },
  //       {
  //         'hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-surface-600/80':
  //           !(context != null && context.highlighted)
  //       },
  //       'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring focus-visible:ring-inset focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
  //       // Transitions
  //       'transition-shadow',
  //       'duration-200',
  //       // Misc
  //       'cursor-pointer',
  //       'overflow-hidden',
  //       'whitespace-nowrap'
  //     ]
  //   }),
  //   filteroperator: {
  //     class: [
  //       'px-5 py-3',
  //       'border-b border-solid',
  //       'rounded-t-md',
  //       'text-surface-700 dark:text-white/80',
  //       'border-surface-200 dark:border-surface-800',
  //       'bg-surface-0 dark:bg-surface-700'
  //     ]
  //   },
  //   filteroperatordropdown: {
  //     root: ({ state }) => ({
  //       class: [
  //         // Display and Position
  //         'inline-flex',
  //         'relative',
  //         // Shape
  //         'w-full',
  //         'rounded-md',
  //         // Color and Background
  //         'bg-surface-0 dark:bg-surface-900',
  //         'border border-surface-300 dark:border-surface-700',
  //         // Transitions
  //         'transition-all',
  //         'duration-200',
  //         // States
  //         'hover:border-primary-500 dark:hover:border-primary-300',
  //         {
  //           'outline-none outline-offset-0 ring ring-primary-400/50 dark:ring-primary-300/50':
  //             state.focused
  //         },
  //         // Misc
  //         'cursor-pointer',
  //         'select-none'
  //       ]
  //     }),
  //     input: ({ props }) => ({
  //       class: [
  //         //Font
  //         'font-sans',
  //         'leading-none',
  //         // Display
  //         'block',
  //         'flex-auto',
  //         // Color and Background
  //         'bg-transparent',
  //         'border-0',
  //         {
  //           'text-surface-800 dark:text-white/80': props.modelValue,
  //           'text-surface-400 dark:text-surface-500': !props.modelValue
  //         },
  //         'placeholder:text-surface-400 dark:placeholder:text-surface-500',
  //         // Sizing and Spacing
  //         'w-[1%]',
  //         'p-3',
  //         //Shape
  //         'rounded-none',
  //         // Transitions
  //         'transition',
  //         'duration-200',
  //         // States
  //         'focus:outline-none focus:shadow-none',
  //         // Misc
  //         'relative',
  //         'cursor-pointer',
  //         'overflow-hidden overflow-ellipsis',
  //         'whitespace-nowrap',
  //         'appearance-none'
  //       ]
  //     }),
  //     trigger: {
  //       class: [
  //         'flex items-center justify-center',
  //         'shrink-0',
  //         'bg-transparent',
  //         'text-surface-500',
  //         'w-12',
  //         'rounded-tr-md',
  //         'rounded-br-md'
  //       ]
  //     },
  //     panel: {
  //       class: [
  //         'absolute top-0 left-0',
  //         'border-0 dark:border',
  //         'rounded-md',
  //         'shadow-md',
  //         'bg-surface-0 dark:bg-surface-800',
  //         'text-surface-800 dark:text-white/80',
  //         'dark:border-surface-700'
  //       ]
  //     },
  //     item: ({ context }) => ({
  //       class: [
  //         // Font
  //         'font-normal',
  //         'leading-none',
  //         // Position
  //         'relative',
  //         // Shape
  //         'border-0',
  //         'rounded-none',
  //         // Spacing
  //         'm-0',
  //         'py-3 px-5',
  //         // Color
  //         {
  //           'text-surface-700 dark:text-white/80': !context.focused && !context.selected
  //         },
  //         {
  //           'bg-surface-50 dark:bg-surface-600/60 text-surface-700 dark:text-white/80':
  //             context.focused && !context.selected
  //         },
  //         {
  //           'bg-primary-100 dark:bg-primary-400/40 text-primary-700 dark:text-white/80':
  //             context.focused && context.selected
  //         },
  //         {
  //           'bg-primary-50 dark:bg-primary-400/40 text-primary-700 dark:text-white/80':
  //             !context.focused && context.selected
  //         },
  //         //States
  //         {
  //           'hover:bg-surface-100 dark:hover:bg-surface-600/80':
  //             !context.focused && !context.selected
  //         },
  //         {
  //           'hover:text-surface-700 hover:bg-surface-100 dark:hover:text-white dark:hover:bg-surface-600/80':
  //             context.focused && !context.selected
  //         },
  //         // Transitions
  //         'transition-shadow',
  //         'duration-200',
  //         // Misc
  //         'cursor-pointer',
  //         'overflow-hidden',
  //         'whitespace-nowrap'
  //       ]
  //     })
  //   },
  //   filterconstraint: {
  //     class: ['py-3 px-5', 'border-b border-solid', 'border-surface-200 dark:border-surface-700']
  //   },
  //   filteraddrule: {
  //     class: 'py-3 px-5'
  //   },
  //   filteraddrulebutton: {
  //     root: {
  //       class: [
  //         'relative',
  //         'items-center inline-flex text-center align-bottom justify-center',
  //         'text-sm py-2 px-3 w-full',
  //         'rounded-md',
  //         'bg-transparent border-transparent',
  //         'text-primary-500 dark:text-primary-400',
  //         'hover:bg-primary-300/20',
  //         'transition duration-200 ease-in-out',
  //         'cursor-pointer overflow-hidden select-none'
  //       ]
  //     },
  //     label: {
  //       class: 'flex-auto grow-0'
  //     },
  //     icon: {
  //       class: 'mr-2'
  //     }
  //   },
  //   filterremovebutton: {
  //     root: {
  //       class: [
  //         'relative',
  //         'items-center inline-flex text-center align-bottom justify-center',
  //         'text-sm py-2 px-3 w-full mt-2',
  //         'rounded-md',
  //         'bg-transparent border-transparent',
  //         'text-red-500 dark:text-red-400',
  //         'hover:bg-red-300/20',
  //         'transition duration-200 ease-in-out',
  //         'cursor-pointer overflow-hidden select-none'
  //       ]
  //     },
  //     label: {
  //       class: 'flex-auto grow-0'
  //     },
  //     icon: {
  //       class: 'mr-2'
  //     }
  //   },
  //   filterbuttonbar: {
  //     class: ['flex items-center justify-between', 'py-3 px-5']
  //   },
  //   filterclearbutton: {
  //     root: {
  //       class: [
  //         'relative',
  //         'items-center inline-flex text-center align-bottom justify-center',
  //         'text-sm py-2 px-3',
  //         'rounded-md',
  //         'text-primary-500 border border-primary-500',
  //         'hover:bg-primary-300/20',
  //         'transition duration-200 ease-in-out',
  //         'cursor-pointer overflow-hidden select-none'
  //       ]
  //     }
  //   },
  //   filterapplybutton: {
  //     root: {
  //       class: [
  //         'relative',
  //         'items-center inline-flex text-center align-bottom justify-center',
  //         'text-sm py-2 px-3',
  //         'rounded-md',
  //         'text-white dark:text-surface-900',
  //         'bg-primary-500 dark:bg-primary-400',
  //         'hover:bg-primary-600 dark:hover:bg-primary-300 hover:border-primary-600 dark:hover:border-primary-300',
  //         'transition duration-200 ease-in-out',
  //         'cursor-pointer overflow-hidden select-none'
  //       ]
  //     }
  //   },
  //   filtermenubutton: ({ context }) => ({
  //     class: [
  //       'relative',
  //       // Flex & Alignment
  //       'inline-flex items-center justify-center',
  //       // Size
  //       'w-8 h-8',
  //       // Spacing
  //       'ml-2',
  //       // Shape
  //       'rounded-full',
  //       // Color
  //       { 'bg-primary-50 text-primary-700': context.active },
  //       'dark:text-white/70 dark:hover:text-white/80 dark:bg-surface-800',
  //       // States
  //       'hover:text-surface-700 hover:bg-surface-300/20',
  //       'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50',
  //       // Transition
  //       'transition duration-200',
  //       // Misc
  //       'cursor-pointer no-underline overflow-hidden'
  //     ]
  //   }),
  //   headerfilterclearbutton: ({ context }) => ({
  //     class: [
  //       'relative',
  //       // Flex & Alignment
  //       'inline-flex items-center justify-center',
  //       'text-left',
  //       // Shape
  //       'border-none',
  //       // Spacing
  //       'm-0 p-0 ml-2',
  //       // Color
  //       'bg-transparent',
  //       // Misc
  //       'cursor-pointer no-underline overflow-hidden select-none',
  //       {
  //         invisible: !context.hidden
  //       }
  //     ]
  //   }),
  //   rowtoggler: {
  //     class: [
  //       'relative',
  //       'inline-flex items-center justify-center',
  //       'text-left',
  //       'm-0 p-0',
  //       'w-8 h-8',
  //       'border-0 rounded-full',
  //       'text-surface-500 dark:text-white/70',
  //       'bg-transparent',
  //       'focus-visible:outline-none focus-visible:outline-offset-0',
  //       'focus-visible:ring focus-visible:ring-primary-400/50 dark:focus-visible:ring-primary-300/50',
  //       'transition duration-200',
  //       'overflow-hidden',
  //       'cursor-pointer select-none'
  //     ]
  //   },
  //   columnresizer: {
  //     class: [
  //       'block',
  //       'absolute top-0 right-0',
  //       'w-2 h-full',
  //       'm-0 p-0',
  //       'border border-transparent',
  //       'cursor-col-resize'
  //     ]
  //   },
  //   rowreordericon: {
  //     class: 'cursor-move'
  //   },
  //   roweditorinitbutton: {
  //     class: [
  //       'relative',
  //       'inline-flex items-center justify-center',
  //       'text-left',
  //       'w-8 h-8',
  //       'border-0 rounded-full',
  //       'text-surface-700 dark:text-white/70',
  //       'border-transparent',
  //       'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50',
  //       'hover:text-surface-700 hover:bg-surface-300/20',
  //       'transition duration-200',
  //       'overflow-hidden',
  //       'cursor-pointer select-none'
  //     ]
  //   },
  //   roweditorsavebutton: {
  //     class: [
  //       'relative',
  //       'inline-flex items-center justify-center',
  //       'text-left',
  //       'w-8 h-8',
  //       'border-0 rounded-full',
  //       'text-surface-700 dark:text-white/70',
  //       'border-transparent',
  //       'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50',
  //       'hover:text-surface-700 hover:bg-surface-300/20',
  //       'transition duration-200',
  //       'overflow-hidden',
  //       'cursor-pointer select-none'
  //     ]
  //   },
  //   roweditorcancelbutton: {
  //     class: [
  //       'relative',
  //       'inline-flex items-center justify-center',
  //       'text-left',
  //       'w-8 h-8',
  //       'border-0 rounded-full',
  //       'text-surface-700 dark:text-white/70',
  //       'border-transparent',
  //       'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 dark:focus:ring-primary-300/50',
  //       'hover:text-surface-700 hover:bg-surface-300/20',
  //       'transition duration-200',
  //       'overflow-hidden',
  //       'cursor-pointer select-none'
  //     ]
  //   },
  //   rowRadiobutton: {
  //     root: {
  //       class: [
  //         'relative',
  //         'inline-flex',
  //         'align-bottom',
  //         'w-[1.571rem] h-[1.571rem]',
  //         'cursor-pointer',
  //         'select-none'
  //       ]
  //     },
  //     box: ({ props }) => ({
  //       class: [
  //         // Flexbox
  //         'flex justify-center items-center',
  //         // Size
  //         'w-[1.571rem] h-[1.571rem]',
  //         // Shape
  //         'border-2',
  //         'rounded-full',
  //         // Transition
  //         'transition duration-200 ease-in-out',
  //         // Colors
  //         {
  //           'text-surface-700 dark:text-white/80': !props.modelValue,
  //           'bg-surface-0 dark:bg-surface-900': !props.modelValue,
  //           'border-surface-300 dark:border-surface-700': !props.modelValue,
  //           'border-primary-500 dark:border-primary-400': props.modelValue,
  //           'bg-primary-500 dark:bg-primary-400': props.modelValue
  //         },
  //         // States
  //         {
  //           'peer-hover:border-primary-500 dark:peer-hover:border-primary-400': !props.disabled,
  //           'peer-hover:border-primary-600 dark:peer-hover:border-primary-300 peer-hover:bg-primary-600 dark:peer-hover:bg-primary-300':
  //             !props.disabled && props.modelValue,
  //           'peer-focus-visible:border-primary-500 dark:peer-focus-visible:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/20 dark:peer-focus-visible:ring-primary-300/20':
  //             !props.disabled,
  //           'opacity-60 cursor-default': props.disabled
  //         }
  //       ]
  //     }),
  //     input: {
  //       class: [
  //         'peer',
  //         'w-full ',
  //         'h-full',
  //         'absolute',
  //         'top-0 left-0',
  //         'z-10',
  //         'p-0',
  //         'm-0',
  //         'opacity-0',
  //         'rounded-md',
  //         'outline-none',
  //         'border-2 border-surface-200 dark:border-surface-700',
  //         'appearance-none',
  //         'cursor-pointer'
  //       ]
  //     },
  //     icon: ({ props }) => ({
  //       class: [
  //         'block',
  //         // Shape
  //         'rounded-full',
  //         // Size
  //         'w-[0.857rem] h-[0.857rem]',
  //         // Colors
  //         'bg-surface-0 dark:bg-surface-900',
  //         // Conditions
  //         {
  //           'backface-hidden scale-10 invisible': !props.modelValue,
  //           'transform visible scale-[1.1]': props.modelValue
  //         },
  //         // Transition
  //         'transition duration-200'
  //       ]
  //     })
  //   },
  //   headercheckbox: {
  //     root: {
  //       class: [
  //         'relative',
  //         'inline-flex',
  //         'align-bottom',
  //         'w-6',
  //         'h-6',
  //         'cursor-pointer',
  //         'select-none'
  //       ]
  //     },
  //     box: ({ props, context }) => ({
  //       class: [
  //         // Alignment
  //         'flex',
  //         'items-center',
  //         'justify-center',
  //         // Size
  //         'w-6',
  //         'h-6',
  //         // Shape
  //         'rounded-md',
  //         'border-2',
  //         // Colors
  //         {
  //           'border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900':
  //             !context.checked,
  //           'border-primary-500 bg-primary-500 dark:border-primary-400 dark:bg-primary-400':
  //             context.checked
  //         },
  //         // States
  //         {
  //           'peer-hover:border-primary-500 dark:peer-hover:border-primary-400':
  //             !props.disabled && !context.checked,
  //           'peer-hover:bg-primary-600 dark:peer-hover:bg-primary-300 peer-hover:border-primary-700 dark:peer-hover:border-primary-300':
  //             !props.disabled && context.checked,
  //           'peer-focus-visible:border-primary-500 dark:peer-focus-visible:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/20 dark:peer-focus-visible:ring-primary-300/20':
  //             !props.disabled,
  //           'cursor-default opacity-60': props.disabled
  //         },
  //         // Transitions
  //         'transition-colors',
  //         'duration-200'
  //       ]
  //     }),
  //     input: {
  //       class: [
  //         'peer',
  //         'w-full ',
  //         'h-full',
  //         'absolute',
  //         'top-0 left-0',
  //         'z-10',
  //         'p-0',
  //         'm-0',
  //         'opacity-0',
  //         'rounded-md',
  //         'outline-none',
  //         'border-2 border-surface-200 dark:border-surface-700',
  //         'appearance-none',
  //         'cursor-pointer'
  //       ]
  //     },
  //     icon: {
  //       class: [
  //         'text-base leading-none',
  //         'w-4',
  //         'h-4',
  //         'text-white dark:text-surface-900',
  //         'transition-all',
  //         'duration-200'
  //       ]
  //     }
  //   },
  //   rowCheckbox: {
  //     root: {
  //       class: [
  //         'relative',
  //         'inline-flex',
  //         'align-bottom',
  //         'w-6',
  //         'h-6',
  //         'cursor-pointer',
  //         'select-none'
  //       ]
  //     },
  //     box: ({ props, context }) => ({
  //       class: [
  //         // Alignment
  //         'flex',
  //         'items-center',
  //         'justify-center',
  //         // Size
  //         'w-6',
  //         'h-6',
  //         // Shape
  //         'rounded-md',
  //         'border-2',
  //         // Colors
  //         {
  //           'border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900':
  //             !context.checked,
  //           'border-primary-500 bg-primary-500 dark:border-primary-400 dark:bg-primary-400':
  //             context.checked
  //         },
  //         // States
  //         {
  //           'peer-hover:border-primary-500 dark:peer-hover:border-primary-400':
  //             !props.disabled && !context.checked,
  //           'peer-hover:bg-primary-600 dark:peer-hover:bg-primary-300 peer-hover:border-primary-700 dark:peer-hover:border-primary-300':
  //             !props.disabled && context.checked,
  //           'peer-focus-visible:border-primary-500 dark:peer-focus-visible:border-primary-400 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/20 dark:peer-focus-visible:ring-primary-300/20':
  //             !props.disabled,
  //           'cursor-default opacity-60': props.disabled
  //         },
  //         // Transitions
  //         'transition-colors',
  //         'duration-200'
  //       ]
  //     }),
  //     input: {
  //       class: [
  //         'peer',
  //         'w-full ',
  //         'h-full',
  //         'absolute',
  //         'top-0 left-0',
  //         'z-10',
  //         'p-0',
  //         'm-0',
  //         'opacity-0',
  //         'rounded-md',
  //         'outline-none',
  //         'border-2 border-surface-200 dark:border-surface-700',
  //         'appearance-none',
  //         'cursor-pointer'
  //       ]
  //     },
  //     icon: {
  //       class: [
  //         'text-base leading-none',
  //         'w-4',
  //         'h-4',
  //         'text-white dark:text-surface-900',
  //         'transition-all',
  //         'duration-200'
  //       ]
  //     }
  //   },
  //   transition: {
  //     enterFromClass: 'opacity-0 scale-y-[0.8]',
  //     enterActiveClass:
  //       'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
  //     leaveActiveClass: 'transition-opacity duration-100 ease-linear',
  //     leaveToClass: 'opacity-0'
  //   }
  // },
  // bodyrow: ({ context, props }) => ({
  //   class: [
  //     // Color
  //     'dark:text-white/80',
  //     {
  //       'bg-primary-0 text-primary-700 dark:bg-primary-400/30': context.selected
  //     },
  //     {
  //       'bg-surface-0 text-surface-600 dark:bg-surface-900': !context.selected
  //     },
  //     { 'font-bold bg-surface-0 dark:bg-surface-900': props.frozenRow },
  //     {
  //       'odd:bg-surface-0 odd:text-surface-600 dark:odd:bg-surface-800 even:bg-surface-50 even:text-surface-600 dark:even:bg-surface-900/50':
  //         context.stripedRows
  //     },
  //     // State
  //     {
  //       'focus:outline-none focus:outline-offset-0 focus:ring focus:ring-primary-400/50 ring-inset dark:focus:ring-primary-300/50':
  //         context.selectable
  //     },
  //     {
  //       'hover:bg-surface-300/20 hover:text-surface-600': props.selectionMode && !context.selected
  //     },
  //     // Transition
  //     {
  //       'transition duration-200': (props.selectionMode && !context.selected) || props.rowHover
  //     },
  //     // Misc
  //     { 'cursor-pointer': props.selectionMode }
  //   ]
  // })
});

const refMenuActions = ref();
const menuActions = computed(() => [
  {
    label: t('Clear filters'),
    icon: 'pi pi-filter-slash',
    command: () => clearFilters()
  },
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: () => emits('toggleModal', {})
  },
  {
    label: t('Update records'),
    icon: 'pi pi-sync',
    command: () => onUpdateRecords()
  }
]);

const refMenuReports = ref();
const menuReports = computed(() => [
  {
    label: t('Export records'),
    icon: 'pi pi-file-export',
    command: () => exportCSV()
  },
  {
    label: t('Export all records'),
    icon: 'pi pi-file-export',
    command: () => helpdesk.notImplemented()
  }
]);

const screenSizeComputed = computed(() => {
  return screenSize.value;
});

const onColumnsMenu = event => {
  refMenuColumns.value.toggle(event);
};

const onRemoveRecord = ({ id }) => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (id) {
        await props.onDelete({ id });
        toast.add({
          severity: 'success',
          summary: t('HD Information'),
          detail: t('Record is removed'),
          life: 3000
        });
        await onUpdateRecords();
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not selected'),
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Record deletion not confirmed'),
        life: 3000
      });
    }
  });
};

const onUpdateRecords = async () => {
  try {
    loading.value = true;
    const { docs, totalDocs, offset, limit } = await props.onUpdate(params.value);
    records.value = docs;
    totalRecords.value = totalDocs;
    offsetRecords.value = Number(offset);
    recordsPerPage.value = limit;
  } catch (err) {
    records.value = [];
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const initParams = () => {
  params.value = {
    offset: offsetRecords.value,
    limit: recordsPerPage.value,
    sortField: null,
    sortOrder: null,
    filters: filterConverter(filters.value)
  };
};

const initColumns = async () => {
  const columns = props.columns
    .filter(({ column }) => column?.field)
    .map(
      async ({
        header,
        column,
        sorter,
        filter,
        selectable,
        exportable,
        filtrable,
        sortable,
        frozen
      }) => {
        return {
          header: {
            text: header?.text || column.field,
            icon: header?.icon || null,
            width: header?.width || '15rem'
          },
          column: {
            field: column.field,
            render(value) {
              return typeof column?.render === 'function' ? (
                column?.render(value)
              ) : (
                <span>{value}</span>
              );
            },
            action(value) {
              return typeof column?.action === 'function' ? column?.action(value) : null;
            }
          },
          sorter: { field: sorter?.field || column.field },
          filter: {
            field: filter?.field ? filter?.field : column.field,
            value: null,
            matchMode: filter?.matchMode ? filter?.matchMode : FilterMatchMode.IN,
            showFilterMatchModes:
              filter?.showFilterMatchModes === undefined ? false : filter?.showFilterMatchModes,
            filterOperator:
              filter?.showFilterMatchModes === undefined
                ? FilterOperator.AND
                : filter?.filterOperator,
            options: filter?.options
              ? {
                  key: filter?.options?.key ? filter?.options?.key : 'id',
                  value: filter?.options?.value ? filter?.options?.value : 'id',
                  label: filter?.options?.label ? filter?.options?.label : 'title',
                  records:
                    typeof filter?.options?.onRecords === 'function'
                      ? await filter?.options?.onRecords()
                      : []
                }
              : null
          },
          selectable: selectable === undefined ? true : selectable,
          exportable: exportable === undefined ? false : exportable,
          filtrable: filtrable === undefined ? false : filtrable,
          sortable: sortable === undefined ? false : sortable,
          frozen: frozen === undefined ? false : frozen
        };
      }
    );

  cols.value = await Promise.all(columns);
};

const initFilters = async () => {
  filters.value = {
    global: {
      value: null,
      matchMode: props?.globalFilter?.matchMode
        ? props?.globalFilter?.matchMode
        : FilterMatchMode.CONTAINS
    },
    ...props.columns
      .filter(column => column?.filtrable)
      .reduce((previousObject, currentObject) => {
        return Object.assign(previousObject, {
          [currentObject.filter.field]: currentObject?.filter?.showFilterMatchModes
            ? {
                operator: FilterOperator.AND,
                constraints: [
                  {
                    value: currentObject.filter.value || null,
                    matchMode: currentObject.filter.matchMode || FilterMatchMode.CONTAINS
                  }
                ]
              }
            : {
                value: currentObject.filter.value || null,
                matchMode: currentObject.filter.matchMode || FilterMatchMode.CONTAINS
              }
        });
      }, {})
  };
};

const clearFilters = async () => {
  initFilters();
  params.value.filters = filterConverter(filters.value);
  await onUpdateRecords();
};

const clearGlobalFilter = async () => {
  if (filters.value?.global) {
    filters.value['global'].value = null;
    params.value.filters = filterConverter(filters.value);
    await onUpdateRecords();
  }
};

const filterConverter = object => {
  const filterMode = (mode, value) => {
    switch (mode) {
      case 'startsWith':
        return { $regex: `^${value}`, $options: 'i' };
      case 'contains':
        return { $regex: value, $options: 'i' };
      case 'notContains':
        return { $not: { $regex: value, $options: 'i' } };
      case 'endsWith':
        return { $regex: `${value}$`, $options: 'i' };
      case 'equals':
        if (typeof value === 'boolean') {
          return value;
        }
        return { $regex: `^${value}$`, $options: 'i' };
      case 'notEquals':
        return { $ne: value };
      case 'in':
        return { $in: value };
      case 'lt':
        return { $lt: value };
      case 'lte':
        return { $lte: value };
      case 'gt':
        return { $gt: value };
      case 'gte':
        return { $gte: value };
      case 'between':
        return { $gte: value[0], $lte: value[1] };
      case 'dateIs':
        let [startDate, endDate] = value;
        startDate = new Date(startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59, 999);
        return {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString()
        };
      case 'dateIsNot':
        return { $ne: value };
      case 'dateBefore':
        return { $lt: value };
      case 'dateAfter':
        return { $gt: value };
      default:
        console.error('Sorry, we are out of ' + mode + '.');
        return;
    }
  };

  const filterObject = {};
  const filterAND = [];
  const filterOR = [];

  for (const prop in object) {
    if (prop === 'global') {
      if (object['global']?.value !== null) {
        filterObject[props.globalFilter.field] = filterMode(
          object['global'].matchMode,
          object['global'].value
        );
      }
      continue;
    }

    if (object[prop]?.value !== undefined && object[prop]?.value !== null) {
      filterObject[prop] = filterMode(object[prop].matchMode, object[prop].value);
    }

    if (object[prop]?.operator === 'and') {
      filterAND.push(
        ...object[prop]?.constraints
          ?.filter(item => item?.value && item?.value !== null)
          ?.map(item => {
            return { [prop]: filterMode(item.matchMode, item.value) };
          })
      );
    }

    if (object[prop]?.operator === 'or') {
      filterOR.push(
        ...object[prop]?.constraints
          ?.filter(item => item?.value && item?.value !== null)
          ?.map(item => {
            return { [prop]: filterMode(item.matchMode, item.value) };
          })
      );
    }
  }

  if (filterAND?.length) {
    filterObject['$and'] = filterAND;
  }

  if (filterOR?.length) {
    filterObject['$or'] = filterOR;
  }

  return filterObject;
};

const sortConverter = value => {
  const sortObject = {};
  if (value.length !== 0) {
    value.forEach(({ field, order }) => {
      sortObject[field] = parseInt(order, 10);
    });
  } else {
    return;
  }
  return sortObject;
};

const exportCSV = () => {
  refDataTable.value.exportCSV();
};

const onPage = async event => {
  const { rows, first } = event;
  params.value.limit = rows;
  params.value.offset = first;
  await onUpdateRecords();
};

const onSort = async event => {
  params.value.sort = sortConverter(event.multiSortMeta);
  await onUpdateRecords();
};

const onFilter = async event => {
  params.value.offset = 0;
  params.value.filters = filterConverter(event.filters);
  await onUpdateRecords();
};

const onStorage = async event => {
  const { rows, first } = event;
  params.value.limit = rows;
  params.value.offset = first;
  // params.value.sort = sortConverter(event.multiSortMeta);
  // params.value.filters = filterConverter(event.filters);
  await onUpdateRecords();
};

const resetLocalStorage = async () => {
  if (props.storageKey) {
    try {
      localStorage.removeItem(props.storageKey);
      refMenuColumns.value.hide();
      keyDataTable.value += 1;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Datatable reset to default'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Datatable not reset to default'),
        life: 3000
      });
    }
  }
};

const selectAllColumns = () => {
  cols.value.filter(col => !col.selectable).forEach(col => (col.selectable = true));
  refMenuColumns.value.hide();
};

const checkScreenSize = () => {
  if (window.matchMedia('(max-width: 640px)').matches) {
    screenSize.value = 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink';
  } else if (window.matchMedia('(max-width: 960px)').matches) {
    screenSize.value =
      'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink';
  } else if (window.matchMedia('(max-width: 1300px)').matches) {
    screenSize.value =
      'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink';
  } else {
    screenSize.value =
      'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown';
  }
};

onMounted(async () => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  try {
    loading.value = true;
    initColumns();
    initFilters();
    initParams();
    await onUpdateRecords();
  } catch (err) {
    records.value = [];
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <Menu popup ref="refMenuColumns" class="w-80 p-2">
    <template #start>
      <Listbox
        filter
        multiple
        class="w-full"
        :options="cols"
        listStyle="height: 21rem"
        dataKey="selectable"
        optionValue="selectable"
        optionLabel="header.text"
        :filterPlaceholder="$t('Search in list')"
      >
        <template #option="{ index, option }">
          <div class="flex items-center">
            <Checkbox
              binary
              :inputId="`${option.column.field}${index}`"
              v-model="option.selectable"
              class="mr-2"
            />
            <label :for="`${option.column.field}${index}`">
              {{ $t(option.header.text) }}
            </label>
          </div>
        </template>
      </Listbox>
    </template>

    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>

    <template #end>
      <div class="flex justify-between gap-3 w-full pt-2">
        <Button
          outlined
          :label="$t('Select All')"
          icon="pi pi-check-square"
          size="small"
          class="w-full text-surface-500"
          @click="selectAllColumns"
        />
      </div>
    </template>
  </Menu>

  <div class="flex w-full overflow-x-auto">
    <DataTable
      lazy
      rowHover
      paginator
      scrollable
      removableSort
      resizableColumns
      reorderableColumns
      alwaysShowPaginator
      ref="refDataTable"
      :key="keyDataTable"
      dataKey="id"
      :stateKey="storageKey"
      stateStorage="local"
      csvSeparator=";"
      sortMode="multiple"
      scrollHeight="flex"
      filterDisplay="menu"
      size="small"
      responsiveLayout="scroll"
      columnResizeMode="expand"
      style="height: calc(100vh - 7rem)"
      :value="records"
      :loading="loading"
      v-model:filters="filters"
      :exportFilename="exportFileName"
      :pageLinkSize="1"
      :first="offsetRecords"
      :rows="recordsPerPage"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="recordsPerPageOptions"
      :currentPageReportTemplate="
        $t('Showing records', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' })
      "
      class="min-w-full overflow-x-auto"
      :paginatorTemplate="screenSizeComputed"
      :pt="dataTableStyle"
      @state-restore="onStorage"
      @filter="onFilter"
      @sort="onSort"
      @page="onPage"
    >
      <template #header>
        <div class="flex flex-wrap gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-1 items-center">
            <slot name="icon" />
            <div class="flex flex-col">
              <h3 class="text-2xl m-0">
                <slot name="title" />
              </h3>
              <p class="text-base text-surface-500">
                <slot name="subtitle" />
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 items-center justify-between sm:w-max w-full">
            <span v-if="globalFilter && filters['global']" class="relative sm:w-max w-full">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                id="name"
                class="sm:w-max w-full px-10"
                :placeholder="$t(globalFilter?.placeholder)"
                v-model="filters['global'].value"
                @keydown.enter="onFilter({ filters })"
              />
              <i
                class="pi pi-times cursor-pointer absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600 hover:text-surface-900 dark:hover:text-surface-300"
                v-tooltip.bottom="$t('Clear global filter')"
                @click="clearGlobalFilter"
              />
            </span>

            <div class="flex gap-2 sm:w-max w-full justify-between">
              <Button
                text
                plain
                rounded
                icon="pi pi-filter-slash"
                class="text-2xl w-12 h-12"
                :class="
                  params?.filters && Object.keys(params.filters).length ? 'text-primary-500' : ''
                "
                v-tooltip.bottom="$t('Clear filters')"
                @click="clearFilters"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-plus-circle"
                class="text-2xl w-12 h-12"
                v-tooltip.bottom="$t('Create record')"
                @click="emits('toggleModal', {})"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-sync"
                class="text-2xl w-12 h-12"
                v-tooltip.bottom="$t('Update records')"
                @click="onUpdateRecords"
              />

              <slot name="actions" />

              <Button
                text
                plain
                rounded
                icon="pi pi-cog"
                class="text-2xl w-12 h-12"
                v-tooltip.bottom="$t('Columns option')"
                @click="onColumnsMenu"
              />
            </div>
          </div>
        </div>

        <slot name="subheader" />
      </template>

      <template #loading>
        <i class="pi pi-spin pi-spinner text-3xl mr-4"></i>
        <span class="text-xl"> {{ $t('Loading records data. Please wait') }}.</span>
      </template>

      <template #empty>
        <div v-if="!loading && records?.length === 0" class="flex flex-col justify-center z-0">
          <i class="pi pi-filter-slash text-surface-500" style="font-size: 4rem"></i>
          <h5>{{ $t('No records found') }}</h5>
          <p>{{ $t('Try changing the search terms in the filter') }}</p>
          <Button
            icon="pi pi-filter-slash"
            iconClass="text-sm"
            class=""
            :label="$t('Clear filters')"
            @click="clearFilters"
          />
        </div>
      </template>

      <template #paginatorstart>
        <div class="flex flex-wrap gap-4 items-center justify-evenly xl:justify-between p-2">
          <div class="flex flex-wrap gap-2 items-center justify-evenly">
            <Button
              text
              plain
              outlined
              icon="pi pi-refresh"
              iconClass="text-xl"
              class="text-2xl w-12 h-12"
              v-tooltip.bottom="$t('Reset to default')"
              @click="resetLocalStorage"
            />

            <Menu ref="refMenuActions" :model="menuActions" popup>
              <template #item="{ label, item, props }">
                <a :href="item.url" v-bind="props.action">
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Menu>
            <Button
              text
              plain
              outlined
              :label="$t('Actions')"
              class="sm:w-max w-full"
              @click="event => refMenuActions.toggle(event)"
            >
              <template #default>
                <i class="pi pi-sliders-h" />
                <span class="mx-2">
                  {{ $t('Actions') }}
                </span>
                <i class="pi pi-chevron-down" />
              </template>
            </Button>

            <Menu ref="refMenuReports" :model="menuReports" popup>
              <template #item="{ label, item, props }">
                <a :href="item.url" v-bind="props.action">
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Menu>
            <Button
              text
              plain
              outlined
              :label="$t('Reports')"
              class="sm:w-max w-full"
              @click="event => refMenuReports.toggle(event)"
            >
              <template #default>
                <i class="pi pi-save" />
                <span class="mx-2">
                  {{ $t('Reports') }}
                </span>
                <i class="pi pi-chevron-down" />
              </template>
            </Button>
          </div>
        </div>
      </template>

      <Column field="options" frozen :exportable="false" :reorderableColumn="false" class="w-6">
        <template #header>
          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            class="font-bold"
            v-tooltip.bottom="$t('Columns option')"
            @click="onColumnsMenu"
          />
        </template>
        <template #body="{ data }">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            class="font-bold"
            v-tooltip.bottom="$t('Optional menu')"
            @click="onOptionsMenu($event, data)"
          />
        </template>
      </Column>

      <Column
        v-for="(
          { header, column, filter, sortable, filtrable, selectable, exportable, frozen }, index
        ) of cols"
        :hidden="!selectable"
        :key="`${column.field}-${index}`"
        :field="column.field"
        :reorderableColumn="!frozen"
        :exportHeader="header.text"
        :sortable="sortable"
        :exportable="exportable"
        :frozen="frozen"
        :filterField="filter.field"
        :showFilterMatchModes="filter.showFilterMatchModes"
        :style="{ minWidth: header.width }"
        headerClass="font-bold text-center uppercase"
        class="max-w-80"
      >
        <template #header>
          <span class="mx-2">
            <i v-if="header?.icon" :class="header.icon" class="mr-2" />
            {{ $t(header?.text) }}
          </span>
        </template>

        <template #body="{ data, field }">
          <div class="whitespace-nowrap overflow-hidden text-ellipsis px-2">
            <component
              v-if="column?.render"
              :is="column?.render(getObjField(data, field))"
              @click="column?.action ? column?.action(data) : false"
            />
            <span v-else>{{ getObjField(data, field) }}</span>
          </div>
        </template>

        <template
          #filter="{ filterModel, filterCallback }"
          v-if="filtrable === undefined ? false : filtrable"
        >
          <Listbox
            filter
            multiple
            class="w-80"
            listStyle="height: 20rem"
            v-model="filterModel.value"
            :dataKey="filter?.options?.key || 'id'"
            :optionValue="filter?.options?.value || 'id'"
            :optionLabel="filter?.options?.label || 'label'"
            :options="filter?.options?.records || []"
            :filterPlaceholder="$t('Search in list')"
            v-if="filter?.matchMode === FilterMatchMode.IN"
          >
            <template #option="{ option }">
              <div class="flex items-center">
                <Checkbox
                  :inputId="option.key"
                  :value="option[filter.options.value]"
                  :modelValue="filterModel.value"
                  class="mr-2"
                />
                <label :for="option.key">
                  {{ option[filter?.options?.label] }}
                </label>
              </div>
            </template>
          </Listbox>

          <Dropdown
            showClear
            v-model="filterModel.value"
            :optionValue="filter.options.value || 'id'"
            :optionLabel="filter.options.label || 'id'"
            :options="filter.options.records || []"
            :placeholder="$t('Select one record')"
            style="min-width: 12rem"
            @change="filterCallback()"
            v-else-if="filter?.matchMode === FilterMatchMode.EQUALS && filter?.options"
          >
            <template #option="slotProps">
              <Chip :label="slotProps.option[filter?.options?.label]" />
            </template>
          </Dropdown>

          <Calendar
            inline
            class="w-[25rem]"
            selectionMode="range"
            dateFormat="dd.mm.yy"
            :placeholder="$t('Select date')"
            v-model="filterModel.value"
            v-else-if="filter?.matchMode === FilterMatchMode.DATE_IS"
          />

          <InputText
            type="text"
            v-model="filterModel.value"
            :placeholder="$t('Search by column')"
            @keydown.enter="filterCallback()"
            v-else-if="filter?.matchMode === FilterMatchMode.CONTAINS"
          />

          <div
            class="flex flex-col items-center gap-3"
            v-else-if="filter?.matchMode === FilterMatchMode.EQUALS"
          >
            <TriStateCheckbox v-model="filterModel.value" inputId="verified-filter" />
            <label for="verified-filter" class="font-bold">
              {{ $t(header.text) }} {{ filterModel.value == null ? '' : filterModel.value }}
            </label>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
