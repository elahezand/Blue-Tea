import React from 'react'
import Image from 'next/image'
import connectToDB from '@/configs/db';
import UserModal from '@/model/user';
import PieChart from '@/components/modules/chart/chart';
import ParetoChart from '@/components/modules/chart/chart1';
import styles from "@/styles/p-admin/p-admin.module.css"
import { getMe } from '@/utils/auth';
import Table from '@/components/modules/table/Table';
export default async function page() {
    connectToDB()
    const users = await UserModal.find()
    const me = await getMe()

    return (
        <div className="container-fluid">
            <div className="row gy-4">
                <div className="col-xl-8">
                    <div className="row g-3">
                        {[
                            { icon: "eye-fill", title: "Profile Views", end: 18600 },
                            { icon: "person-fill", title: "Total Users", end: 126500 },
                            { icon: "person-plus-fill", title: "New Users", end: 95600 },
                            { icon: "bookmark-dash-fill", title: "Bookmarks", end: 452 },
                        ].map((item, i) => (
                            <div key={i} className="col-6 col-xl-3">
                                <div className={styles.card}>
                                    <div className={styles.card_body}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <div className={`stats-icon ${styles.icon}`}>
                                                    <i className={`bi bi-${item.icon} lh-0`} />
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="fs-7 text-muted">{item.title}</h6>
                                                <h6 className="fw-bold mb-0">{item.end.toLocaleString()}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card-header">
                                <h5 className="fw-bold mb-3 text-white">Analytics Overview</h5>
                            </div>
                            <div className="card-body">
                                <ParetoChart />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4">
                    <div className={styles.card}>
                        <div className="card-body p-4 d-flex align-items-center">
                            <Image
                                src={me.avatar}
                                width={70}
                                height={70}
                                className="rounded-circle"
                                alt="User avatar"
                            />
                            <div className="ms-3">
                                <h6 className="fw-bold">{me.name}</h6>
                                <p className="fw-bold">{me.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="card-header">
                            <h5 className="fw-bold mb-3 text-white">User Activity</h5>
                        </div>
                        <div className="card-body">
                            <PieChart />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-3 mt-4">
                {/* Progress Bars */}
                <div className="col-xl-4">
                    <div className={styles.card}>
                        <div className="card-header">
                            <h5 className="fw-bold mb-3">Lorem Ipsum Text</h5>
                        </div>
                        <div className="card-body">
                            <div>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "75%", backgroundColor: "var(--green-olive)" }}
                                        aria-valuenow={75}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        75%
                                    </div>
                                </div>
                                <p className="fs-7 text-muted mt-2">Lorem Ipsum dummy text</p>
                            </div>
                            <hr />
                            <div>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "50%", backgroundColor: "var(--green-olive)" }}
                                        aria-valuenow={50}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        50%
                                    </div>
                                </div>
                                <p className="fs-7 text-muted mt-2">Lorem Ipsum dummy text</p>
                            </div>
                            <hr />
                            <div>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "66%", backgroundColor: "var(--green-olive)" }}
                                        aria-valuenow={66}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        66%
                                    </div>
                                </div>
                                <p className="fs-7 text-muted mt-2">Lorem Ipsum dummy text</p>
                            </div>
                            <hr />
                            <div>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "45%", backgroundColor: "var(--green-olive)" }}
                                        aria-valuenow={45}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        45%
                                    </div>
                                </div>
                                <p className="fs-7 text-muted mt-2">Lorem Ipsum dummy text</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Latest Users Table */}
                <div className="col-xl-8">
                    <Table title={"Latest Users"}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {JSON.parse(JSON.stringify(users)).map((u, index) => (
                                <tr key={index + 1}>
                                    <td className=" text-white number">{index + 1}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                {/* Latest Action */}
            </div>
        </div>
    );

}


