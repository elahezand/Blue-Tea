"use client"
import React  from 'react'
import styles from "@/styles/p-admin/p-admin.module.css"

export default function IndexClient() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12 my-5">
                    <div className="row g-3">
                        {[
                            { icon: "bag-check-fill", title: "Active Orders", end: 3 },
                            { icon: "star-fill", title: "Loyalty Points", end: 450 },
                            { icon: "heart-fill", title: "Wishlist Items", end: 12 },
                            { icon: "wallet2", title: "Total Spent", end: "$1,200" },
                        ].map((item, index) => (
                            <div key={index + 1} className="col-6 col-xl-3">
                                <div className={styles.card}>
                                    <div className={styles.card_body}>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-4 text-center">
                                                <div className="stats-icon fw-bold fs-3">
                                                    <i className={`bi bi-${item.icon} lh-0`} />
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="fs-7 text-white mb-1">{item.title}</h6>
                                                <h6 className="fw-bold mb-0 text-white">{item.end}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-xl-12">
                    <div className={styles.card}>
                        <div className="card-header bg-transparent border-0">
                            <h5 className="fw-bold mb-0 p-3">Reward Progress</h5>
                        </div>
                        <div className="card-body px-4 pb-4">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small">Points for Free Coffee</span>
                                    <span className="small fw-bold">75%</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div
                                        className="progress-bar"
                                        style={{ width: "75%", backgroundColor: "var(--green-olive)" }}
                                    ></div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


