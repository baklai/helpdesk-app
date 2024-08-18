<script setup lang="jsx">
import { ref, computed, reactive, inject, watch, defineAsyncComponent } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();
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
    name: yup.string().required(t('Value is required')),
    description: yup.string().required(t('Value is required')),
    datacollection: yup.string().required(t('Value is required')),
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
    label: t('Save record'),
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const datacollections = ref([
  {
    name: 'ipaddresses',
    label: 'Network IP Address',
    description: 'Network IP Address of the technical support',
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
                { key: 'opened', name: t('Internet opened') },
                { key: 'closed', name: t('Internet closed') },
                { key: 'missing', name: t('Not Internet') }
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
                  '!text-base font-bold cursor-pointer px-4',
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
              <i class={'pi pi-check-circle font-bold text-green-500 ml-4'}></i>
            ) : (
              <i class={'pi pi-lock font-bold text-surface-500 ml-4'}></i>
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
              <i class="pi pi-check-circle text-green-500 font-bold" />
            ) : (
              <i class="pi pi-info-circle text-orange-500 font-bold" />
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
                  '!text-base !text-black dark:!text-white !font-semibold w-12 h-8',
                  value?.warning ? ' !bg-orange-500/90' : '!bg-surface-500/20'
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
                  '!text-base !text-black dark:!text-white !font-semibold w-12 h-8',
                  value?.warning ? ' !bg-orange-500/90' : '!bg-surface-500/20'
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
                  '!text-base !text-black dark:!text-white !font-semibold w-12 h-8',
                  value?.warning ? ' !bg-orange-500/90' : '!bg-surface-500/20'
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
            return <Tag class={'text-base  font-medium w-3 '} value={value} />;
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
      summary: t('Warning'),
      detail: t('Record not selected'),
      life: 5000
    });
  }
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: t('Information'),
          detail: t('Record is removed'),
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('Record not removed'),
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Record deletion not confirmed'),
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
      summary: t('Information'),
      detail: values?.id ? t('Record is updated') : t('Record is created'),
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: values?.id ? t('Record not updated') : t('Record not created'),
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
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="reports" :size="42" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Report template') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
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
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <Stepper orientation="vertical" class="px-6" v-model:activeStep="active">
      <StepperPanel :header="$t('Basics')">
        <template #header="props">
          <i
            :class="[
              'pi pi-info-circle',
              'text-3xl mr-2',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            {{ $t('Basics') }}
          </span>
        </template>
        <template #content="{ nextCallback }">
          <div class="flex flex-col min-h-60">
            <div
              class="border border-dashed border-surface-200 dark:border-surface-700 rounded-md flex-auto flex font-medium"
            >
              <div class="flex flex-col w-full md:w-3/5 p-6">
                <p class="text-2xl block mb-6">
                  {{ $t('Basics') }}
                </p>
                <div class="flex flex-col gap-2 mb-4">
                  <label for="name" class="font-semibold">
                    {{ $t('Report name') }}
                  </label>
                  <InputText
                    id="name"
                    v-model="name"
                    v-bind="titleAttrs"
                    :placeholder="$t('Report name')"
                    :invalid="!!errors?.name"
                    aria-describedby="name-help"
                  />
                  <small id="name-help" class="text-red-500" v-if="errors?.name">
                    {{ $t(errors.name) }}
                  </small>
                </div>
                <div class="flex flex-col gap-2 mb-4">
                  <label for="description" class="font-semibold">
                    {{ $t('Report description') }}
                  </label>
                  <InputText
                    id="description"
                    v-model="description"
                    v-bind="descriptionAttrs"
                    :placeholder="$t('Report description')"
                    :invalid="!!errors?.description"
                    aria-describedby="description-help"
                  />
                  <small id="description-help" class="text-red-500" v-if="errors?.description">
                    {{ $t(errors.description) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="flex py-4">
            <Button
              :label="$t('Next')"
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

      <StepperPanel :header="$t('Data collections')">
        <template #header="props">
          <i
            :class="[
              'pi pi-database',
              'text-3xl mr-2',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            {{ $t('Data collections') }}
          </span>
        </template>

        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col min-h-60">
            <div
              class="border border-dashed border-surface-200 dark:border-surface-700 rounded-md flex-auto flex font-medium"
            >
              <div class="flex flex-col w-full md:w-3/5 p-6">
                <p class="text-2xl block mb-6">
                  {{ $t('Data table collection') }}
                </p>
                <div class="flex flex-col gap-2 mb-4">
                  <label for="collection" class="font-semibold">
                    {{ $t('Data table collection') }}
                  </label>
                  <Dropdown
                    filter
                    autofocus
                    optionValue="name"
                    optionLabel="label"
                    inputId="datacollection"
                    v-model="datacollection"
                    v-bind="datacollectionAttrs"
                    :options="datacollections"
                    :filterPlaceholder="$t('Search in list')"
                    :placeholder="$t('Select collection')"
                  >
                    <template #option="{ option }">
                      <div class="flex flex-col">
                        <p class="text-xl font-medium text-black dark:text-white">
                          {{ $t(option.label) }}
                        </p>
                        <p>{{ $t(option.description) }}</p>
                      </div>
                    </template>
                  </Dropdown>
                  <small
                    id="datacollection-help"
                    class="text-red-500"
                    v-if="errors?.datacollection"
                  >
                    {{ $t(errors.datacollection) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div class="flex py-4 gap-2">
            <Button :label="$t('Back')" severity="secondary" @click="prevCallback" />
            <Button
              :label="$t('Next')"
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

      <StepperPanel :header="$t('Collection fields')">
        <template #header="props">
          <i
            :class="[
              'pi pi-table',
              'text-3xl mr-2',
              {
                'text-primary-400': props.active
              }
            ]"
          />
          <span
            :class="['uppercase', props.active ? 'font-extrabold text-primary-400' : 'font-bold']"
          >
            {{ $t('Collection fields') }}
          </span>
        </template>

        <template #content="{ prevCallback, nextCallback }">
          <div class="flex flex-col min-h-60">
            <div
              class="border border-dashed border-surface-200 dark:border-surface-700 rounded-md flex-auto flex font-medium"
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
                  <i class="pi pi-table text-5xl mr-2 block" />
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
          <div class="flex py-4 gap-2">
            <Button :label="$t('Back')" severity="secondary" @click="prevCallback" />
            <Button :label="$t('Next')" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>

      <StepperPanel :header="$t('Summary')">
        <template #header="slotProps">
          <i
            :class="[
              'pi pi-chart-bar',
              'text-3xl mr-2',
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
            {{ $t('Summary') }}
          </span>
        </template>

        <template #content="{ prevCallback }">
          <div class="flex flex-col min-h-60">
            <div class="flex flex-col gap-2 py-4 pl-8">
              <p class="text-xl font-bold">
                {{ $t('Report name') }} : <span class="font-normal">{{ name }}</span>
              </p>
              <p class="text-xl font-bold">
                {{ $t('Report description') }} : <span class="font-normal">{{ description }}</span>
              </p>

              <div class="flex text-xl font-bold py-4">
                {{ $t('Data collection') }} :
                <div class="px-2">
                  <p class="font-normal">{{ datatable?.label }}</p>
                  <p class="text-sm font-normal">{{ datatable?.description }}</p>
                </div>
              </div>

              <p class="text-xl font-bold">
                {{ $t('Report created by') }} :
                <span class="font-normal">
                  {{ profile.fullname }}
                </span>
              </p>
            </div>
          </div>
          <div class="flex py-4 gap-2">
            <Button :label="$t('Back')" severity="secondary" @click="prevCallback" />
            <Button :label="$t('Save')" @click="onSaveRecord" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
