<script setup>
import { ref, computed, inject } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { useRequest } from '@/stores/api/requests';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const $helpdesk = inject('helpdesk');

const { findOne, createOne, updateOne, removeOne } = useRequest();

const IPAddress = useIPAddress();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();

const {
  values,
  errors,
  handleSubmit,
  controlledValues,
  setValues,
  resetForm,
  defineComponentBinds
} = useForm({
  validationSchema: yup.object({
    fullname: yup.string().required(t('Value is required')),
    phone: yup.string().required(t('Value is required')),
    request: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        setValues(await findOne({ id, populate: false }));
      }

      const [organization, department, position, location] = await Promise.allSettled([
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({}),
        Location.findAll({})
      ]);
      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;
      locations.value = location.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const organizations = ref([]);
const subdivisions = ref([]);
const departments = ref([]);
const positions = ref([]);
const locations = ref([]);

const ipaddress = defineComponentBinds('ipaddress');
const fullname = defineComponentBinds('fullname');
const phone = defineComponentBinds('phone');
const position = defineComponentBinds('position');
const location = defineComponentBinds('location');
const organization = defineComponentBinds('organization');
const subdivision = defineComponentBinds('subdivision');
const department = defineComponentBinds('department');
const request = defineComponentBinds('request');
const reqnum = defineComponentBinds('reqnum');
const conclusion = defineComponentBinds('conclusion');
const comment = defineComponentBinds('comment');

const isClosed = computed(() => {
  return values?.workerClose ? true : false;
});

const refMenu = ref();
const options = ref([
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: t('Save record'),
    icon: 'pi pi-save',
    disabled: isClosed,
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const onSubdivisionsUpdate = async event => {
  if (event?.value) {
    subdivisions.value = await Subdivision.findAllByOrganizationId({ id: event.value });
  } else {
    setValues({
      organization: null,
      subdivision: null
    });
    subdivisions.value = [];
  }
};

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};

const findOneIPAddress = async () => {
  try {
    if (values?.ipaddress) {
      const record = await IPAddress.findOneByIP({ ipaddress: values.ipaddress });
      if (record?.ipaddress) {
        setValues({
          ipaddress: record?.ipaddress || null,
          location: record?.location || null,
          fullname: record?.fullname || null,
          phone: record?.phone || null,
          position: record?.position || null,
          organization: record?.organization || null,
          subdivision: record?.subdivision || null,
          department: record?.department || null
        });
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('IP Address not found'),
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('IP Address not entered'),
        life: 3000
      });
    }
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
};

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Input new record'),
    life: 3000
  });
};

const onRemoveRecord = async () => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (values?.id) {
        try {
          await removeOne(values);
          toast.add({
            severity: 'success',
            summary: t('HD Information'),
            detail: t('Record is removed'),
            life: 3000
          });
        } catch (err) {
          toast.add({
            severity: 'warn',
            summary: t('HD Warning'),
            detail: t('Record not removed'),
            life: 3000
          });
        } finally {
          visible.value = false;
        }
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

const onSaveRecord = handleSubmit(async () => {
  if (values?.id) {
    try {
      await updateOne(values.id, { ...controlledValues.value, workerClose: values.workerClose });
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is updated'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Record not updated'),
        life: 3000
      });
    }
  } else {
    try {
      await createOne({
        ...controlledValues.value,
        workerOpen: $helpdesk?.user?.id || undefined,
        workerClose: values.workerClose || undefined
      });
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is created'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Record not created'),
        life: 3000
      });
    }
  }
});

const onSaveClosedRecord = handleSubmit(async () => {
  setValues({
    workerClose: $helpdesk?.user?.id || undefined
  });

  await onSaveRecord();
});
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
    class="!w-[60rem]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="helpdesk-live-log" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Help Desk Live Log') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500" v-show="!isClosed">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Status') }} :
              {{ isClosed ? $t('Request closed') : $t('Request opened') }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form
      @submit.prevent="onSaveRecord"
      class="flex flex-col justify-center gap-3 text-surface-800 dark:text-surface-100"
    >
      <div class="flex flex-row gap-x-4">
        <div class="flex flex-col basis-1/2 gap-y-4">
          <div class="flex flex-col gap-2">
            <label for="request" class="font-bold">{{ $t('Client request') }}</label>
            <Textarea
              rows="8"
              id="request"
              v-bind="request"
              :placeholder="$t('Client request')"
              :invalid="!!errors?.request"
              aria-describedby="request-help"
            />
            <small id="request-help" class="text-red-500" v-if="errors?.request">
              {{ $t(errors.request) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
            <InputText id="reqnum" v-bind="reqnum" :placeholder="$t('Letter number')" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="ipaddress" class="font-bold">{{ $t('IP Address') }}</label>
            <span class="relative">
              <InputText
                id="ipaddress"
                v-bind="ipaddress"
                :placeholder="$t('Client IP Address')"
                :invalid="!!errors?.ipaddress"
                class="w-full pr-10"
                @keypress.enter="findOneIPAddress"
                aria-describedby="ipaddress-help"
              />
              <i
                class="pi pi-search cursor-pointer absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600 hover:!text-primary-500"
                v-tooltip.bottom="$t('Find IP Address')"
                @click.prevent="findOneIPAddress"
              />
            </span>
            <small id="ipaddress-help" class="text-red-500" v-if="errors?.ipaddress">
              {{ $t(errors.ipaddress) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="conclusion" class="font-bold">{{ $t('Conclusion for request') }}</label>
            <Textarea
              rows="5"
              aria-describedby="conclusion-help"
              id="conclusion"
              v-bind="conclusion"
              :placeholder="$t('Conclusion')"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea rows="3" id="comment" v-bind="comment" :placeholder="$t('Comment')" />
          </div>
        </div>

        <div class="flex flex-col basis-1/2 gap-y-4">
          <div class="flex flex-col gap-2">
            <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
            <div class="flex flex-col gap-2" id="client-info">
              <div class="flex flex-col gap-2">
                <InputText
                  id="fullname"
                  v-bind="fullname"
                  :placeholder="$t('Client fullname')"
                  :invalid="!!errors?.fullname"
                  aria-describedby="fullname-help"
                />
                <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <InputText
                  id="phone"
                  v-bind="phone"
                  :placeholder="$t('Client phone')"
                  :invalid="!!errors?.phone"
                  aria-describedby="phone-help"
                />
                <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                  {{ $t(errors.phone) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex flex-row w-full gap-2">
                  <Dropdown
                    filter
                    autofocus
                    showClear
                    resetFilterOnHide
                    dataKey="id"
                    optionValue="id"
                    optionLabel="name"
                    inputId="position"
                    v-bind="position"
                    :options="positions"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client position')"
                    :invalid="!!errors?.position"
                    aria-describedby="position-help"
                    class="w-[25rem]"
                  />

                  <BtnDBTable table="position" />
                </div>

                <small id="position-help" class="text-red-500" v-if="errors?.position">
                  {{ $t(errors.position) }}
                </small>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="location" class="font-bold">{{ $t('Location') }}</label>
            <div class="flex flex-row w-full gap-2">
              <Dropdown
                filter
                autofocus
                showClear
                resetFilterOnHide
                dataKey="id"
                optionValue="id"
                optionLabel="name"
                inputId="location"
                v-bind="location"
                :options="locations"
                :filterPlaceholder="$t('Search')"
                :placeholder="$t('Client location')"
                :invalid="!!errors?.location"
                aria-describedby="location-help"
                class="w-[25rem]"
              />

              <BtnDBTable table="location" />
            </div>

            <small id="location-help" class="text-red-500" v-if="errors?.location">
              {{ $t(errors.location) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="organizations" class="font-bold">{{ $t('Organization') }}</label>
            <div class="flex flex-col gap-2" id="organizations">
              <div class="flex flex-col gap-2">
                <div class="flex flex-row gap-2">
                  <Dropdown
                    filter
                    autofocus
                    showClear
                    resetFilterOnHide
                    dataKey="id"
                    optionValue="id"
                    optionLabel="name"
                    inputId="organization"
                    v-bind="organization"
                    :options="organizations"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client organization')"
                    :invalid="!!errors?.organization"
                    aria-describedby="organization-help"
                    class="w-[25rem]"
                    @change="onSubdivisionsUpdate"
                  />
                  <BtnDBTable table="organization" />
                </div>
                <small id="organization-help" class="text-red-500" v-if="errors?.organization">
                  {{ $t(errors.organization) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex flex-row gap-2">
                  <Dropdown
                    filter
                    autofocus
                    showClear
                    resetFilterOnHide
                    dataKey="id"
                    optionValue="id"
                    optionLabel="name"
                    inputId="subdivision"
                    v-bind="subdivision"
                    :options="subdivisions"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client subdivision')"
                    :invalid="!!errors?.subdivision"
                    aria-describedby="subdivision-help"
                    class="w-[25rem]"
                  />
                  <BtnDBTable table="subdivision" />
                </div>
                <small id="subdivision-help" class="text-red-500" v-if="errors?.subdivision">
                  {{ $t(errors.subdivision) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex flex-row w-full gap-2">
                  <Dropdown
                    filter
                    autofocus
                    showClear
                    resetFilterOnHide
                    dataKey="id"
                    optionValue="id"
                    optionLabel="name"
                    inputId="department"
                    v-bind="department"
                    :options="departments"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client department')"
                    :invalid="!!errors?.department"
                    aria-describedby="department-help"
                    class="w-[25rem]"
                  />

                  <BtnDBTable table="department" />
                </div>

                <small id="department-help" class="text-red-500" v-if="errors?.department">
                  {{ $t(errors.department) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button
        text
        plain
        icon="pi pi-times"
        :label="$t('Cancel')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="visible = false"
      />

      <Button
        text
        plain
        icon="pi pi-check"
        :label="$t('Save')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveRecord"
      />

      <Button
        text
        plain
        icon="pi pi-check-circle"
        :label="$t('Save and closed')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveClosedRecord"
      />
    </template>
  </Dialog>
</template>
