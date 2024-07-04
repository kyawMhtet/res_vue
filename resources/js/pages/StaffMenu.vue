<template>
    <div class="app mt-2">
        <div class="d-flex gap-2">
            <h4>Staffs</h4>

            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                data-bs-target="#registerModal">Register</button>
        </div>


        <table :class="['table mt-3 table-hover table-striped', tableTheme]">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <!-- <th scope="col">Password</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(staff, index) in staffs" :key="staff.id">





                    <th scope="row">{{ index + 1 }} .</th>
                    <td>{{ staff.name }}</td>
                    <td>{{ staff.email }}</td>
                    <td v-if="staff.role === null || staff.role === undefined">
                        <button type="button" class="btn btn-sm btn-dark" data-bs-toggle="modal"
                            :data-bs-target="'#exampleModal' + staff.id">
                            Add Role
                        </button>
                    </td>
                    <td v-else>
                        <span
                            :class="{ 'badge text-bg-danger': staff.role === 'admin', 'badge text-bg-success ': staff.role !== 'admin' }">
                            {{ staff.role }}

                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- register modal -->
        <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
            data-bs-backdrop="static">
            <div class="modal-dialog">
                <form action="" @submit.prevent="addStaff">

                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Register Staff</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div>
                                <label for="">Name:</label>
                                <input type="text" placeholder="Staff Name" class="form-control mt-1"
                                    v-model="newStaff.name">
                            </div>

                            <div class="my-3">
                                <label for="">Email:</label>
                                <input type="email" placeholder="example@gmail.com" class="form-control mt-1"
                                    v-model="newStaff.email">
                            </div>

                            <div class="mb-3">
                                <label for="">Password:</label>
                                <input type="text" placeholder="********" class="form-control mt-1"
                                    v-model="newStaff.password">
                                <button type="button" class="btn btn-sm" @click="generatePassword">generate
                                    password</button>
                            </div>

                            <div>
                                <label for="">Role:</label>
                                <select name="" id="" class="form-control mt-1" v-model="newStaff.role">
                                    <option value="" selected>Choose Role</option>
                                    <option :value="role.name" v-for="role in roles" :key="role.id">
                                        {{ role.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>


        <!-- add role modal -->
        <div v-for="staff in staffs" :key="staff.id">
            <form @submit.prevent="addRole(staff.id)">
                <div class="modal fade" :id="'exampleModal' + staff.id" tabindex="-1"
                    aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <select name="" class="form-control text-capitalize" v-model="newRole">
                                    <option value="" selected>Choose Role</option>

                                    <option v-for="role in roles" :key="role.id" :value="role.name">
                                        {{ role.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
    name: 'StaffMenu',

    data() {
        return {
            staffs: [],
            roles: [],
            newRole: '',

            newStaff: {
                name: '',
                email: '',
                password: '',
                role: '',
            }
        }
    },

    computed: {
        ...mapGetters(['getTheme']),

        tableTheme() {
            return this.getTheme ? 'table-dark' : '';
        }
    },

    methods: {
        generatePassword() {
            let length = 8;

            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';

            let password = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            // return password;
            this.newStaff.password = password;
        },


        async getStaffs() {
            try {
                let res = await axios.get('http://localhost:8000/api/users');
                console.log(res.data);
                this.staffs = res.data.users;
                this.roles = res.data.roles;
            } catch (error) {
                console.log(error.message);
            }
        },

        async addStaff() {
            try {
                let addNewStaff = {
                    name: this.newStaff.name,
                    email: this.newStaff.email,
                    role: this.newStaff.role,
                    password: this.newStaff.password
                }

                let res = await axios.post('http://localhost:8000/api/users', addNewStaff);
                console.log(res.data.user);

                this.staffs.push(res.data.user);

                this.newStaff = { name: '', email: '', password: '', role: '' };

            } catch (error) {
                console.log(error.message);
            }

        },


        async addRole(staffId) {
            try {
                let res;
                const user = this.staffs.find(staff => staff.id === staffId);

                if (user.role === null || user.role === undefined) {
                    // Create a new role
                    res = await axios.post(`http://localhost:8000/api/users/${staffId}/roles`, {
                        role: this.newRole
                    });
                } else {
                    // Update the existing role
                    res = await axios.patch(`http://localhost:8000/api/users/${staffId}/roles`, {
                        role: this.newRole
                    });
                }

                console.log(res.data); // Log response for debugging

                // Update local staffs array with the new role
                // this.staffs = this.staffs.map(staff => {
                //     if (staff.id === staffId) {
                //         return { ...staff, role: { name: this.newRole } };
                //     }
                //     return staff;
                // });

                // Optionally, close the modal after successful update
                // const modalId = '#exampleModal' + staffId;
                // $(modalId).modal('hide');

            } catch (error) {
                console.error('Error adding/updating role:', error);
            }
        }

    },

    mounted() {
        this.getStaffs();
    }
}
</script>

<style scoped>
.table-dark {
    color: #fff;
    /* Text color for dark mode */
    background-color: #343a40;
    /* Background color for dark mode */

    /* Optional: Add box-shadow or border-radius for styling */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    /* Optional: Shadow for table */
    border-radius: 8px;
    /* Optional: Rounded corners */
}
</style>
