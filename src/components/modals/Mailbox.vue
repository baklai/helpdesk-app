<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { dateToStr } from '@/service/DataFilters';
import { useMailbox } from '@/stores/api/mailboxes';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useMailbox();

const Location = useLocation();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      reqnum: yup.string().required(t('Value is required')),
      login: yup.string().required(t('Value is required')),
      fullname: yup.string().required(t('Value is required')),
      phone: yup.string().required(t('Value is required')),
      dateOpen: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const response = await findOne({ id, populate: false });
        setValues(response);
        if (response.organization) {
          subdivisions.value = await Subdivision.findAllByOrganizationId({
            id: response.organization
          });
        }
      }
      const [location, organization, department, position] = await Promise.allSettled([
        Location.findAllGroured({}),
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({})
      ]);
      locations.value = location.value;
      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;

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
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
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

const locations = ref([]);
const organizations = ref([]);
const subdivisions = ref([]);
const departments = ref([]);
const positions = ref([]);

const [reqnum, reqnumAttrs] = defineField('reqnum');
const [login, loginAttrs] = defineField('login');
const [fullname, fullnameAttrs] = defineField('fullname');
const [phone, phoneAttrs] = defineField('phone');
const [dateOpen, dateOpenAttrs] = defineField('dateOpen');
const [dateClose, dateCloseAttrs] = defineField('dateClose');
const [location, locationAttrs] = defineField('location');
const [organization, organizationAttrs] = defineField('organization');
const [subdivision, subdivisionAttrs] = defineField('subdivision');
const [department, departmentAttrs] = defineField('department');
const [position, positionAttrs] = defineField('position');
const [comment, commentAttrs] = defineField('comment');

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

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: t('Information'),
    detail: t('Input new record'),
    life: 5000
  });
};

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
      await updateOne(values.id, controlledValues.value);
    } else {
      await createOne(controlledValues.value);
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
          <AppIcons name="network-mailbox" :size="42" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Mailbox') }}
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

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="dateOpen" class="font-bold">{{ $t('Date open') }}</label>
          <Calendar
            showIcon
            showButtonBar
            dateFormat="dd.mm.yy"
            inputId="dateOpen"
            v-model="dateOpen"
            v-bind="dateOpenAttrs"
            :modelValue="dateToStr(values.dateOpen)"
            :placeholder="$t('Date open')"
            :invalid="!!errors?.dateOpen"
            aria-describedby="dateOpen-help"
            :pt="{
              dropdownbutton: {
                root: {
                  class: [
                    'relative',
                    'items-center inline-flex text-center align-bottom',
                    'rounded-r-md',
                    'px-4 py-3 leading-none',
                    'text-surface-500 dark:text-surface-300',
                    'border border-l-0 border-surface-300 dark:border-surface-600',
                    'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                  ]
                }
              }
            }"
          />
          <small id="dateOpen-help" class="text-red-500" v-if="errors?.dateOpen">
            {{ $t(errors.dateOpen) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
          <InputText
            id="reqnum"
            v-model="reqnum"
            v-bind="reqnumAttrs"
            :placeholder="$t('Letter number')"
            :invalid="!!errors?.reqnum"
            aria-describedby="reqnum-help"
          />
          <small id="reqnum-help" class="text-red-500" v-if="errors?.reqnum">
            {{ $t(errors.reqnum) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="login" class="font-bold">{{ $t('Login mailbox') }}</label>
          <InputText
            id="login"
            v-model="login"
            v-bind="loginAttrs"
            :placeholder="$t('Login mailbox')"
            :invalid="!!errors?.login"
            aria-describedby="login-help"
          />
          <small id="login-help" class="text-red-500" v-if="errors?.login">
            {{ $t(errors.login) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="dateClose" class="font-bold">{{ $t('Date close') }}</label>
          <Calendar
            showIcon
            showButtonBar
            dateFormat="dd.mm.yy"
            aria-describedby="dateClose-help"
            inputId="dateClose"
            v-model="dateClose"
            v-bind="dateCloseAttrs"
            :modelValue="dateToStr(values.dateClose)"
            :placeholder="$t('Date close')"
            :pt="{
              dropdownbutton: {
                root: {
                  class: [
                    'relative',
                    'items-center inline-flex text-center align-bottom',
                    'rounded-r-md',
                    'px-4 py-3 leading-none',
                    'text-surface-500 dark:text-surface-300',
                    'border border-l-0 border-surface-300 dark:border-surface-600',
                    'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                  ]
                }
              }
            }"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
          <Textarea
            id="comment"
            rows="6"
            class="outline-none"
            v-model="comment"
            v-bind="commentAttrs"
            :placeholder="$t('Comment')"
          />
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
          <div class="flex flex-col gap-2" id="client-info">
            <div class="flex flex-col gap-2">
              <InputText
                id="fullname"
                v-model="fullname"
                v-bind="fullnameAttrs"
                :placeholder="$t('Client fullname')"
                v-tooltip.bottom="$t('Client fullname')"
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
                v-model="phone"
                v-bind="phoneAttrs"
                :placeholder="$t('Client phone')"
                v-tooltip.bottom="$t('Client phone')"
                :invalid="!!errors?.phone"
                aria-describedby="phone-help"
              />
              <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                {{ $t(errors.phone) }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location" class="font-bold">{{ $t('Location') }}</label>
          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              optionGroupLabel="group"
              optionGroupChildren="records"
              inputId="location"
              v-model="location"
              v-bind="locationAttrs"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :invalid="!!errors?.location"
              aria-describedby="location-help"
              :virtualScrollerOptions="{ itemSize: 32 }"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] },
                itemgroup: {
                  class: [
                    'font-bold m-0 py-3 px-5 cursor-auto',
                    'text-surface-800 dark:text-white/80',
                    'bg-surface-200 dark:bg-surface-900/80'
                  ]
                }
              }"
            >
              <template #optiongroup="{ option }">
                <div class="flex items-center h-full justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex items-center h-full text-base">
                  {{ option.name }}
                </div>
              </template>
            </Dropdown>

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
                  v-model="organization"
                  v-bind="organizationAttrs"
                  :options="organizations"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client organization')"
                  v-tooltip.bottom="$t('Client organization')"
                  :invalid="!!errors?.organization"
                  aria-describedby="organization-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
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
                  :optionLabel="
                    option => {
                      return option.code && option.code !== option.name
                        ? `${option.code} - ${option.name}`
                        : option.name;
                    }
                  "
                  inputId="subdivision"
                  v-model="subdivision"
                  v-bind="subdivisionAttrs"
                  :options="subdivisions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client subdivision')"
                  v-tooltip.bottom="$t('Client subdivision')"
                  :invalid="!!errors?.subdivision"
                  aria-describedby="subdivision-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
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
                  v-model="department"
                  v-bind="departmentAttrs"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  v-tooltip.bottom="$t('Client department')"
                  :invalid="!!errors?.department"
                  aria-describedby="department-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />

                <BtnDBTable table="department" />
              </div>

              <small id="department-help" class="text-red-500" v-if="errors?.department">
                {{ $t(errors.department) }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="position" class="font-bold">{{ $t('Client position') }}</label>

          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              inputId="position"
              v-model="position"
              v-bind="positionAttrs"
              :options="positions"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client position')"
              :invalid="!!errors?.position"
              aria-describedby="position-help"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] }
              }"
            />

            <BtnDBTable table="position" />
          </div>

          <small id="position-help" class="text-red-500" v-if="errors?.position">
            {{ $t(errors.position) }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
