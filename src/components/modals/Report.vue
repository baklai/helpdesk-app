<script setup lang="jsx">
import { ref, computed, reactive, inject, watch, defineAsyncComponent } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

const HDReportTable = defineAsyncComponent(() => import('@/components/tables/HDReportTable.vue'));

import { dateToStr, dateTimeToStr, byteToStr } from '@/service/DataFilters';

import { useReport } from '@/stores/api/reports';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useMailbox } from '@/stores/api/mailboxes';
import { useRequest } from '@/stores/api/requests';
import { useInspector } from '@/stores/api/inspectors';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useProfile } from '@/stores/api/profiles';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';
import { useUnit } from '@/stores/api/units';

const toast = useToast();
const confirm = useConfirm();

const { profile } = inject('helpdesk');

const { findOne, createOne, updateOne, removeOne } = useReport();

const IPAddress = useIPAddress();
const Mailbox = useMailbox();
const Request = useRequest();
const Inspector = useInspector();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Profile = useProfile();
const Position = usePosition();
const Location = useLocation();
const Unit = useUnit();

const active = ref(0);

const {
  values,
  errors,
  handleSubmit,
  controlledValues,
  resetForm,
  defineField,
  setFieldValue,
  validateField
} = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Потрібно вказати значення'),
    description: yup.string().required('Потрібно вказати значення'),
    datacollection: yup.string().required('Потрібно вказати значення'),
    fields: yup.string(),
    filters: yup.string(),
    sorts: yup.string()
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const {
          name,
          description,
          datacollection,
          sorts = null,
          filters = null,
          fields = null
        } = await findOne({ id });
        setFieldValue('name', name);
        setFieldValue('description', description);
        setFieldValue('datacollection', datacollection);
        setFieldValue('fields', fields);
        setFieldValue('filters', filters);
        setFieldValue('sorts', sorts);
      }
      active.value = 0;
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const refMenu = ref();
const options = ref([
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const datacollections = ref([
  {
    name: 'ipaddresses',
    label: 'IP Адреси мережі',
    description: 'IP Адреси мережі технічної підтримки',
    onUpdate: IPAddress.findAll,
    columns: [
      {
        header: { text: 'Location', width: '15rem' },
        column: { field: 'location.name' },
        sorter: { field: 'location.name' },
        filter: {
          field: 'location',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            grouped: true,
            onRecords: async () => {
              return await Location.findAllGroured({});
            }
          }
        }
      },

      {
        header: { text: 'Unit', width: '12rem' },
        column: { field: 'unit.name' },
        sorter: { field: 'unit.name' },
        filter: {
          field: 'unit',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Unit.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Letter number', width: '16rem' },
        column: { field: 'reqnum' },
        sorter: { field: 'reqnum' },
        filter: {
          field: 'reqnum',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Opened date', width: '16rem' },
        column: {
          field: 'date',
          render(value) {
            return <span>{dateToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'date' },
        filter: {
          field: 'date',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'IP Address', width: '15rem' },
        column: {
          field: 'ipaddress',
          render(value) {
            return <span class="font-bold text-primary-500">{value}</span>;
          }
        },
        sorter: { field: 'indexip' },
        filter: {
          field: 'ipaddress',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Internet', width: '12rem' },
        column: {
          field: 'inetStatus',
          dataType: 'boolean',
          render(value) {
            return value ? (
              <i class={'pi pi-check-circle font-bold text-green-500'}></i>
            ) : (
              <span>-</span>
            );
          }
        },
        sorter: { field: 'inetStatus' },
        filter: {
          field: 'internet',
          value: null,
          matchMode: FilterMatchMode.EQUALS,
          options: {
            key: 'key',
            value: 'key',
            label: 'name',
            onRecords: () => {
              return [
                { key: 'opened', name: 'Інтернет відкрито' },
                { key: 'closed', name: 'Інтернет закрито' },
                { key: 'missing', name: 'Відсутній Інтернет' }
              ];
            }
          }
        }
      },

      {
        header: { text: 'Mask', width: '12rem' },
        column: { field: 'mask' }
      },

      {
        header: { text: 'Gateway', width: '12rem' },
        column: { field: 'gateway' }
      },

      {
        header: { text: 'Updated', width: '15rem' },
        column: {
          field: 'updatedAt',
          render(value) {
            return <span class="mr-3">{dateTimeToStr(value)}</span>;
          }
        },
        sorter: { field: 'updatedAt' },
        filter: {
          field: 'updatedAt',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Fullname', width: '16rem' },
        column: { field: 'fullname' },
        sorter: { field: 'fullname' },
        filter: {
          field: 'fullname',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Position', width: '16rem' },
        column: { field: 'position.name' },
        sorter: { field: 'position.name' },
        filter: {
          field: 'position',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Position.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Phone', width: '12rem' },
        column: { field: 'phone' },
        sorter: { field: 'phone' },
        filter: {
          field: 'phone',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Organization', width: '16rem' },
        column: { field: 'organization.name' },
        sorter: { field: 'organization.name' },
        filter: {
          field: 'organization',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Organization.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Subdivision', width: '16rem' },
        column: { field: 'subdivision.name' },
        sorter: { field: 'subdivision.name' },
        filter: {
          field: 'subdivision',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Subdivision.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Department', width: '16rem' },
        column: { field: 'department.name' },
        sorter: { field: 'department.name' },
        filter: {
          field: 'department',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Department.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Autoanswer', width: '14rem' },
        column: { field: 'autoanswer' },
        sorter: { field: 'autoanswer' },
        filter: {
          field: 'autoanswer',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Comment', width: '25rem' },
        column: { field: 'comment' }
      }
    ]
  },

  {
    name: 'mailboxes',
    label: 'Mailbox addresses',
    description: 'Mailbox of the technical support',
    onUpdate: Mailbox.findAll,
    columns: [
      {
        header: { text: 'Login', width: '14rem' },
        column: {
          field: 'login',
          render(value) {
            return (
              <Tag
                class={[
                  'cursor-pointer px-4 !text-base font-bold',
                  '!bg-surface-500/5',
                  '!text-primary-600'
                ]}
                value={value}
              />
            );
          }
        },
        sorter: { field: 'login' },
        filter: {
          field: 'login',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Letter number', width: '20rem' },
        column: { field: 'reqnum' },
        sorter: { field: 'reqnum' },
        filter: {
          field: 'reqnum',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Date open', width: '16rem' },
        column: {
          field: 'dateOpen',
          render(value) {
            return <span>{dateToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'dateOpen' },
        filter: {
          field: 'dateOpen',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Updated', width: '15rem' },
        column: {
          field: 'updatedAt',
          render(value) {
            return <span class="mr-3">{dateTimeToStr(value)}</span>;
          }
        },
        sorter: { field: 'updatedAt' },
        filter: {
          field: 'updatedAt',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Status', width: '10rem' },
        column: {
          field: 'status',
          render(value) {
            return value ? (
              <i class={'pi pi-check-circle ml-4 font-bold text-green-500'}></i>
            ) : (
              <i class={'pi pi-lock ml-4 font-bold text-surface-500'}></i>
            );
          }
        },
        sorter: { field: 'status' },
        filter: {
          field: 'status',
          value: null,
          matchMode: FilterMatchMode.EQUALS,
          showFilterMatchModes: false
        }
      },

      {
        header: { text: 'Fullname', width: '18rem' },
        column: { field: 'fullname' },
        sorter: { field: 'fullname' },
        filter: {
          field: 'fullname',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Location', width: '15rem' },
        column: { field: 'location.name' },
        sorter: { field: 'location.name' },
        filter: {
          field: 'location',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            grouped: true,
            onRecords: async () => {
              return await Location.findAllGroured({});
            }
          }
        }
      },

      {
        header: { text: 'Organization', width: '16rem' },
        column: { field: 'organization.name' },
        sorter: { field: 'organization.name' },
        filter: {
          field: 'organization',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Organization.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Subdivision', width: '16rem' },
        column: { field: 'subdivision.name' },
        sorter: { field: 'subdivision.name' },
        filter: {
          field: 'subdivision',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Subdivision.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Department', width: '16rem' },
        column: { field: 'department.name' },
        sorter: { field: 'department.name' },
        filter: {
          field: 'department',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Department.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Position', width: '16rem' },
        column: { field: 'position.name' },
        sorter: { field: 'position.name' },
        filter: {
          field: 'position',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Position.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Phone', width: '12rem' },
        column: { field: 'phone' },
        sorter: { field: 'phone' },
        filter: {
          field: 'phone',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Date close', width: '16rem' },
        column: {
          field: 'dateClose',
          render(value) {
            return <span>{dateToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'dateClose' },
        filter: {
          field: 'dateClose',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Comment', width: '25rem' },
        column: { field: 'comment' }
      }
    ]
  },

  {
    name: 'requests',
    label: 'Technical support',
    description: 'Technical support log of the clients',
    onUpdate: Request.findAll,
    columns: [
      {
        header: { text: 'Opened an request', width: '16rem' },
        column: { field: 'workerOpen.fullname' },
        sorter: { field: 'workerOpen.fullname' },
        filter: {
          field: 'workerOpen',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'fullname',
            onRecords: async () => {
              return await Profile.find();
            }
          }
        }
      },

      {
        header: { text: 'Date opened', width: '15rem' },
        column: {
          field: 'createdAt',
          render(value) {
            return <span class="font-semibold">{dateTimeToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'createdAt' },
        filter: {
          field: 'createdAt',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Status', width: '12rem' },
        column: {
          field: 'status',
          render(value) {
            return value ? (
              <i class="pi pi-check-circle font-bold text-green-500" />
            ) : (
              <i class="pi pi-info-circle font-bold text-orange-500" />
            );
          }
        },
        sorter: { field: 'status' },
        filter: {
          field: 'status',
          value: null,
          matchMode: FilterMatchMode.EQUALS,
          showFilterMatchModes: false
        }
      },

      {
        header: { text: 'Letter number', width: '16rem' },
        column: { field: 'reqnum' },
        sorter: { field: 'reqnum' },
        filter: {
          field: 'reqnum',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Request', width: '25rem' },
        column: {
          field: 'request',
          render(value) {
            return <span class="font-semibold">{value}</span>;
          }
        },
        sorter: { field: 'request' },
        filter: {
          field: 'request',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Location', width: '15rem' },
        column: { field: 'location.name' },
        sorter: { field: 'location.name' },
        filter: {
          field: 'location',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            grouped: true,
            onRecords: async () => {
              return await Location.findAllGroured({});
            }
          }
        }
      },

      {
        header: { text: 'Fullname', width: '16rem' },
        column: { field: 'fullname' },
        sorter: { field: 'fullname' },
        filter: {
          field: 'fullname',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Phone', width: '15rem' },
        column: { field: 'phone' },
        sorter: { field: 'phone' },
        filter: {
          field: 'phone',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Position', width: '16rem' },
        column: { field: 'position.name' },
        sorter: { field: 'position.name' },
        filter: {
          field: 'position',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Position.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'IP Address', width: '16rem' },
        column: { field: 'ipaddress' },
        sorter: { field: 'ipaddress' },
        filter: {
          field: 'ipaddress',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Organization', width: '16rem' },
        column: { field: 'organization.name' },
        sorter: { field: 'organization.name' },
        filter: {
          field: 'organization',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Organization.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Subdivision', width: '16rem' },
        column: { field: 'subdivision.name' },
        sorter: { field: 'subdivision.name' },
        filter: {
          field: 'subdivision',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Subdivision.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Department', width: '16rem' },
        column: { field: 'department.name' },
        sorter: { field: 'department.name' },
        filter: {
          field: 'department',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'name',
            onRecords: async () => {
              return await Department.findAll({});
            }
          }
        }
      },

      {
        header: { text: 'Date closed', width: '15rem' },
        column: {
          field: 'updatedAt',
          render(value) {
            return <span>{dateTimeToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'updatedAt' },
        filter: {
          field: 'updatedAt',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'Closed an request', width: '16rem' },
        column: { field: 'workerClose.fullname' },
        sorter: { field: 'workerClose.fullname' },
        filter: {
          field: 'workerClose',
          value: null,
          matchMode: FilterMatchMode.IN,
          options: {
            key: 'id',
            value: 'id',
            label: 'fullname',
            onRecords: async () => {
              return await User.find();
            }
          }
        }
      },

      {
        header: { text: 'Conclusion for request', width: '25rem' },
        column: { field: 'conclusion' }
      },

      {
        header: { text: 'Comment', width: '25rem' },
        column: { field: 'comment' }
      }
    ]
  },

  {
    name: 'inspectors',
    label: 'PC SysInspector',
    description: 'PC SysInspector service of the technical support',
    onUpdate: Inspector.findAll,
    columns: [
      {
        header: { text: 'PC Name', width: '16rem' },
        column: {
          field: 'system.csname',
          render(value) {
            return (
              <div class="font-semibold">
                <i class="pi pi-desktop mr-2"></i>
                <span>{value}</span>
              </div>
            );
          }
        },
        sorter: { field: 'system.csname' },
        filter: {
          field: 'os.CSName',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Baseboard', width: '16rem' },
        column: { field: 'baseboard' },
        sorter: { field: 'baseboard.SerialNumber' },
        filter: {
          field: 'baseboard.SerialNumber',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'IP Address', width: '15rem' },
        column: {
          field: 'host',
          render(value) {
            return <span class="font-bold text-primary-500">{value}</span>;
          }
        },
        sorter: { field: 'host' },
        filter: {
          field: 'host',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Users', width: '13rem' },
        column: {
          field: 'inspector.useraccount',
          render(value) {
            return (
              <Tag
                class={[
                  'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
                  value?.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
                ]}
                value={value?.count || '-'}
              />
            );
          }
        },
        sorter: { field: 'useraccount' },
        filter: {
          field: 'useraccount.Name',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Products', width: '13rem' },
        column: {
          field: 'inspector.product',
          render(value) {
            return (
              <Tag
                class={[
                  'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
                  value?.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
                ]}
                value={value?.count || '-'}
              />
            );
          }
        },
        sorter: { field: 'product' },
        filter: {
          field: 'product.Name',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'SMB Share', width: '13rem' },
        column: {
          field: 'inspector.share',
          render(value) {
            return (
              <Tag
                class={[
                  'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
                  value?.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
                ]}
                value={value?.count || '-'}
              />
            );
          }
        },
        sorter: { field: 'share' },
        filter: {
          field: 'share.Name',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Fix Update', width: '13rem' },
        column: {
          field: 'fixupdate',
          render(value) {
            return <Tag class={'w-3 text-base font-medium'} value={value} />;
          }
        },
        sorter: { field: 'fixupdate' },
        filter: {
          field: 'fixupdate.HotFixID',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'Report date', width: '15rem' },
        column: {
          field: 'updatedAt',
          render(value) {
            return <span>{dateTimeToStr(value) || '-'}</span>;
          }
        },
        sorter: { field: 'updatedAt' },
        filter: {
          field: 'updatedAt',
          value: null,
          matchMode: FilterMatchMode.DATE_IS
        }
      },

      {
        header: { text: 'OS Name', width: '20rem' },
        column: { field: 'system.osname' },
        sorter: { field: 'system.osname' },
        filter: {
          field: 'os.Caption',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'OS Platform', width: '15rem' },
        column: {
          field: 'system.platform',
          render(value) {
            return <span>{value ? value : '32-bit'}</span>;
          }
        },
        sorter: { field: 'system.platform' },
        filter: {
          field: 'os.OSArchitecture',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'OS Version', width: '12rem' },
        column: { field: 'system.version' },
        sorter: { field: 'system.version' },
        filter: {
          field: 'os.Version',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'CPU', width: '25rem' },
        column: { field: 'cpu' },
        sorter: { field: 'cpu' },
        filter: {
          field: 'cpu.Name',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'RAM', width: '15rem' },
        column: {
          field: 'ram',
          render(value) {
            return <span>{byteToStr(value)}</span>;
          }
        },
        sorter: { field: 'ram' },
        filter: {
          field: 'ram',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      },

      {
        header: { text: 'HDD', width: '12rem' },
        column: {
          field: 'hdd',
          render(value) {
            return <span>{byteToStr(value)}</span>;
          }
        },
        sorter: { field: 'hdd' },
        filter: {
          field: 'hdd',
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
          filterOperator: FilterOperator.AND,
          showFilterMatchModes: true
        }
      }
    ]
  }
]);

const [name, titleAttrs] = defineField('name');
const [description, descriptionAttrs] = defineField('description');
const [datacollection, datacollectionAttrs] = defineField('datacollection');
const [sorts, sortsAttrs] = defineField('sorts');
const [fields, fieldsAttrs] = defineField('fields');
const [filters, filtersAttrs] = defineField('filters');

const datatable = computed(() => {
  return datacollection.value
    ? {
        ...datacollections.value.find(({ name }) => name === datacollection.value),
        fields: fields?.value ? JSON.parse(fields.value) : null,
        filters: filters?.value ? JSON.parse(filters.value) : null,
        sorts: sorts?.value ? JSON.parse(sorts.value) : null
      }
    : {
        columns: [],
        fields: null,
        filters: null,
        sorts: null,
        onUpdate: () => {
          return { docs: [], totalDocs: 0, offset: 0, limit: 5 };
        }
      };
});

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 5000
      });
    }
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    if (values?.id) {
      await updateOne(values.id, { creator: profile.fullname, ...controlledValues.value });
    } else {
      await createOne({ creator: profile.fullname, ...controlledValues.value });
    }
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: values?.id ? 'Запис оновлено' : 'Запис створено',
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: values?.id ? 'Запис не оновлено' : 'Запис не створено',
      life: 5000
    });
  }
});

const onCloseModal = async () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="reports" :size="42" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">Шаблон звіту</p>
            <p class="line-height-2 text-base font-normal text-surface-500">
              {{ values?.id ? 'Редагувати обраний запис' : 'Створити новий запис' }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="'Меню опцій'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <Stepper orientation="vertical" class="px-6" v-model:activeStep="active">
      <StepperPanel header="Основи">
        <template #header="props">
          <i
            :class="[
              'pi pi-info-circle',
              'mr-2 text-3xl',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            Основи
          </span>
        </template>
        <template #content="{ nextCallback }">
          <div class="flex min-h-60 flex-col">
            <div
              class="flex flex-auto rounded-md border border-dashed border-surface-200 font-medium dark:border-surface-700"
            >
              <div class="flex w-full flex-col p-6 md:w-3/5">
                <p class="mb-6 block text-2xl">Основи</p>
                <div class="mb-4 flex flex-col gap-2">
                  <label for="name" class="font-semibold"> Назва звіту </label>
                  <InputText
                    id="name"
                    v-model="name"
                    v-bind="titleAttrs"
                    placeholder="Назва звіту"
                    :invalid="!!errors?.name"
                    aria-describedby="name-help"
                  />
                  <small id="name-help" class="text-red-500" v-if="errors?.name">
                    {{ errors.name }}
                  </small>
                </div>
                <div class="mb-4 flex flex-col gap-2">
                  <label for="description" class="font-semibold"> Опис звіту </label>
                  <InputText
                    id="description"
                    v-model="description"
                    v-bind="descriptionAttrs"
                    placeholder="Опис звіту"
                    :invalid="!!errors?.description"
                    aria-describedby="description-help"
                  />
                  <small id="description-help" class="text-red-500" v-if="errors?.description">
                    {{ errors.description }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="flex py-4">
            <Button
              label="Далі"
              @click="
                async () => {
                  const { valid: isNameValid } = await validateField('name');
                  const { valid: isDescriptionValid } = await validateField('description');
                  if (isNameValid && isDescriptionValid) {
                    nextCallback();
                  }
                }
              "
            />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel header="Колекції даних">
        <template #header="props">
          <i
            :class="[
              'pi pi-database',
              'mr-2 text-3xl',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            Колекції даних
          </span>
        </template>

        <template #content="{ prevCallback, nextCallback }">
          <div class="flex min-h-60 flex-col">
            <div
              class="flex flex-auto rounded-md border border-dashed border-surface-200 font-medium dark:border-surface-700"
            >
              <div class="flex w-full flex-col p-6 md:w-3/5">
                <p class="mb-6 block text-2xl">Колекція таблиці даних</p>
                <div class="mb-4 flex flex-col gap-2">
                  <label for="collection" class="font-semibold"> Колекція таблиці даних </label>
                  <Dropdown
                    filter
                    autofocus
                    optionValue="name"
                    optionLabel="label"
                    inputId="datacollection"
                    v-model="datacollection"
                    v-bind="datacollectionAttrs"
                    :options="datacollections"
                    filterPlaceholder="Пошук у списку"
                    placeholder="Вибрати колекцію"
                  >
                    <template #option="{ option }">
                      <div class="flex flex-col">
                        <p class="text-xl font-medium text-black dark:text-white">
                          {{ option.label }}
                        </p>
                        <p>{{ option.description }}</p>
                      </div>
                    </template>
                  </Dropdown>
                  <small
                    id="datacollection-help"
                    class="text-red-500"
                    v-if="errors?.datacollection"
                  >
                    {{ errors.datacollection }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-2 py-4">
            <Button label="Назад" severity="secondary" @click="prevCallback" />
            <Button
              label="Далі"
              @click="
                async () => {
                  const { valid: isCollectionValid } = await validateField('datacollection');
                  if (isCollectionValid) {
                    nextCallback();
                  }
                }
              "
            />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel header="Поля колекції">
        <template #header="props">
          <i
            :class="[
              'pi pi-table',
              'mr-2 text-3xl',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            Поля колекції
          </span>
        </template>

        <template #content="{ prevCallback, nextCallback }">
          <div class="flex min-h-60 flex-col">
            <div
              class="flex flex-auto rounded-md border border-dashed border-surface-200 font-medium dark:border-surface-700"
            >
              <HDReportTable
                :columns="datatable?.columns"
                :fields="datatable?.fields"
                :filters="datatable?.filters"
                :sorts="datatable?.sorts"
                :onUpdate="datatable?.onUpdate"
                @update-sorts="data => setFieldValue('sorts', JSON.stringify(data))"
                @update-filters="data => setFieldValue('filters', JSON.stringify(data))"
                @update-fields="data => setFieldValue('fields', JSON.stringify(data))"
              >
                <template #icon>
                  <i class="pi pi-table mr-2 block text-5xl" />
                </template>

                <template #title>
                  {{ datatable?.label }}
                </template>

                <template #subtitle>
                  {{ datatable?.description }}
                </template>
              </HDReportTable>
            </div>
          </div>
          <div class="flex gap-2 py-4">
            <Button label="Назад" severity="secondary" @click="prevCallback" />
            <Button label="Далі" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel header="Резюме">
        <template #header="slotProps">
          <i
            :class="[
              'pi pi-chart-bar',
              'mr-2 text-3xl',
              {
                'text-primary-400': slotProps.active
              }
            ]"
          />
          <span
            :class="[
              'uppercase',
              slotProps.active ? 'font-extrabold text-primary-400' : 'font-bold'
            ]"
          >
            Резюме
          </span>
        </template>

        <template #content="{ prevCallback }">
          <div class="flex min-h-60 flex-col">
            <div class="flex flex-col gap-2 py-4 pl-8">
              <p class="text-xl font-bold">
                Назва звіту : <span class="font-normal">{{ name }}</span>
              </p>
              <p class="text-xl font-bold">
                Опис звіту : <span class="font-normal">{{ description }}</span>
              </p>

              <div class="flex py-4 text-xl font-bold">
                Data collection :
                <div class="px-2">
                  <p class="font-normal">{{ datatable?.label }}</p>
                  <p class="text-sm font-normal">{{ datatable?.description }}</p>
                </div>
              </div>

              <p class="text-xl font-bold">
                Звіт створений :
                <span class="font-normal">
                  {{ profile.fullname }}
                </span>
              </p>
            </div>
          </div>
          <div class="flex gap-2 py-4">
            <Button label="Назад" severity="secondary" @click="prevCallback" />
            <Button label="Зберегти" @click="onSaveRecord" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
