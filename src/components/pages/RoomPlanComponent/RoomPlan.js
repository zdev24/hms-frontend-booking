import axios from 'axios';
import moment from "moment";
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import apiService from "../../../services/api.service";
import styles from './RoomPlan.module.css';

class RoomPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            using_date: moment(new Date()).format("YYYY-MM-DD"),
            searchData: [],
            checkinData: [],
            checkoutData: [],
            restData: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.handleSearchByUsingDate();
    }

    handleSearchByUsingDate() {
        this.setState({
            searchData: [],
            checkinData: [],
            checkoutData: [],
            restData: [],
            isLoading: true
        });
        apiService.getRoomPlanData(this.state.using_date).then(axios.spread((...responses) => {
            if (responses && responses.length > 0) {
                this.setupData(responses[0].data);
                this.setupCheckoutData(responses[1].data);
            }
            this.updateState("isLoading", false);
        })).catch(err => {
            console.log(err);
            this.updateState("isLoading", false);
        })
    }

    setupCheckoutData(data) {
        data = data.reduce((finalList, item) => {
            if (item.room_id && finalList.every(item1 => item1.room_id !== item.room_id)) {
                finalList = [...finalList, item];
            }
            return finalList;
        }, []);
        this.updateState("checkoutData", data);
    }

    setupData(data) {
        data = data.reduce((finalList, item) => {
            if (item.room_id && finalList.every(item1 => item1.room_id !== item.room_id)) {
                finalList = [...finalList, item];
            }
            return finalList;
        }, []);
        this.updateState("searchData", data);
        const checkinData = data.filter(item => (item.booking_checkin_date === this.state.using_date) && item.room_id);
        const restData = data.filter(item => {
            const usingDateLong = new Date(this.state.using_date).getTime();
            const checkoutDateLong = new Date(item.booking_checkout_date).getTime();
            const checkinDateLong = new Date(item.booking_checkin_date).getTime();
            return item.room_id && (checkinDateLong + 86400000 <= usingDateLong) && (usingDateLong + 86400000 <= checkoutDateLong);
        })
        this.updateState("checkinData", checkinData);
        this.updateState("restData", restData);
    }

    handleChangeDate(event) {
        this.updateState(event.target.name, event.target.value);
    }

    updateState(key, value) {
        this.setState({
            [key]: value
        });
    }

    render() {
        return (
            <div className={"container-fluid"}>
                <Row>
                    <Col>
                        <h4 className="p-3">Kế hoạch vệ sinh</h4>
                        <div className={styles.functionsGroup}>
                            <div className={styles.functionsDate}>
                                <div>
                                    <div>Ngày sử dụng:</div>
                                    <input className="form-control" type="date" name="using_date" onChange={(e) => this.handleChangeDate(e)} value={this.state.using_date} />
                                </div>
                                <button className="btn btn-primary" onClick={() => { this.handleSearchByUsingDate() }}>Xem dữ liệu</button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {this.state.isLoading ?
                    <div className="progress-bar-container">
                        <div className="spinner-border text-primary"></div>
                    </div> : <div>
                        <Row className={"p-3"}>
                            <Col>
                                <h6>Danh sách các phòng checkout</h6>
                                <div>
                                    {this.state.checkoutData.length > 0 ? <div className={styles.roomContainer}>
                                        {this.state.checkoutData.map((item, idx) => {
                                            return (
                                                <div key={idx} className={styles.roomItem}>{item.room_name}</div>
                                            )
                                        })}
                                    </div> : <div className={styles.alertNoData}>Không có dữ liệu</div>}
                                </div>
                            </Col>
                        </Row>

                        <Row className={"p-3"}>
                            <Col>
                                <h6>Danh sách các phòng checkin</h6>
                                <div>
                                    {this.state.checkinData.length > 0 ? <div className={styles.roomContainer}>
                                        {this.state.checkinData.map((item, idx) => {
                                            return (
                                                <div key={idx} className={styles.roomItem}>{item.room_name}</div>
                                            )
                                        })}
                                    </div> : <div className={styles.alertNoData}>Không có dữ liệu</div>}
                                </div>
                            </Col>
                        </Row>

                        <Row className={"p-3"}>
                            <Col>
                                <h6>Danh sách các phòng ở</h6>
                                <div>
                                    {this.state.restData.length > 0 ? <div className={styles.roomContainer}>
                                        {this.state.restData.map((item, idx) => {
                                            return (
                                                <div key={idx} className={styles.roomItem}>{item.room_name}</div>
                                            )
                                        })}
                                    </div> : <div className={styles.alertNoData}>Không có dữ liệu</div>}
                                </div>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        )
    }
}

export default RoomPlan;