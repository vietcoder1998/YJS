import React, { Component } from 'react';
import { Input, Select, Button, Icon, Modal, Tabs } from 'antd';
import './SearchBox.scss';
import { _requestToServer } from '../../../../service/exec';
import { GET } from '../../../../const/method';
import { list_jobs_active, list_area_active } from '../../../../service/api/public.api';
import { public_host } from '../../../../environment/development';
import { noInfoHeader } from '../../../../service/auth';
import MapContainer from '../../../layout/google-maps/MapContainer';
import { connect } from 'react-redux';
import { SEARCH_JOB_DTO } from '../../../../redux/const/jobResult';

const InputGroup = Input.Group;
const { Option } = Select;
const { TabPane } = Tabs;
let list_week = [
    { name: 'Thứ hai', shortcut: 'MON' },
    { name: 'Thứ ba', shortcut: 'TUE' },
    { name: 'Thứ tư', shortcut: 'WED' },
    { name: 'Thứ năm', shortcut: 'THU' },
    { name: 'Thứ sáu', shortcut: 'FRI' },
    { name: 'Thứ bảy', shortcut: 'SAT' },
    { name: 'Chủ nhật', shortcut: 'SUN' }];

let list_day_times = [
    { name: 'Ca sáng', shortcut: 'MOR' },
    { name: 'Ca Chiều ', shortcut: 'AFT' },
    { name: 'Ca Tối', shortcut: 'EVN' }
]

let region = JSON.parse(localStorage.getItem('region'));

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job_dto: { name: '', id: 0 },
            list_day: {
                MON: true,
                TUE: true,
                WED: true,
                THU: true,
                FRI: true,
                SAT: true,
                SUN: true,
            },

            jobType: 'PARTTIME',

            list_shift: {
                MOR: true,
                AFT: true,
                EVN: true,
            },

            show_days: true,
            list_jobs: [],
            list_area: [],
            data_jobs: [],
            data_area: [],
            show_modal: false,
            location: {
                marker: {
                    lat: 0,
                    lng: 0
                },
                address: ''
            },

            area: {
                id: 0,
                name: '',
                totalJobs: 0
            },

            show_location: false,
            choose_location: false
        }
    }

    _isMounted = false;

    componentWillMount() {
        if (region) {
            this.setState({ area: region })
        }
    }

    async componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown);
        this._getListJob();
    }

    async _getListJob() {
        try {
            let { list_jobs, list_area, data_area, data_jobs } = this.state;
            let res_job = await _requestToServer(GET, null, list_jobs_active, public_host, noInfoHeader);
            let res_area = await _requestToServer(GET, null, list_area_active, public_host, noInfoHeader);
            if (res_job.code === 200) {
                list_jobs = res_job.data.items;
                data_jobs = list_jobs.map((item) => { return item.name });
            }

            if (res_area.code === 200) {
                list_area = res_area.data.items;
                data_area = list_area.map((item) => { return item.name });
            }

            this.setState({ list_jobs, data_jobs, list_area, data_area });
        } catch (err) {
            throw err;
        }
    }

    _handleInput = (event) => {
        let { job_dto } = this.state;
        this.setState({ job_dto })
    }

    _handleSearch = (event) => {

    }

    _handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this._createRequest();
        }
    }

    _handleShift = (e) => {
        let { list_shift } = this.state;
        let shift = e.target.id;
        list_shift[shift] = !list_shift[shift];
        this.setState({ list_shift });
    }

    _handleTime = (e) => {
        let { list_day } = this.state;
        let day = e.target.id;
        list_day[day] = !list_day[day];
        this.setState({ list_day });
    }

    _handleShowDay = (jobType, show_days) => {
        let show_days_;
        if (show_days) {
            show_days_ = show_days
        } else {
            show_days = false
        };

        this.setState({ show_days: show_days_, jobType })
    }

    _selectJob = (e) => {
        let { job_dto } = this.state;
        job_dto.name = e.key;
        job_dto.id = e.item.props.id;
        this.setState({ job_dto });
    }

    _handleOk = () => {
        let { location, show_location, choose_location } = this.state;
        if (choose_location) {
            location.address = localStorage.getItem('location');
            location.marker = this.props.marker;
        }

        show_location = true;
        this.setState({ show_modal: false, location, show_location })
    }

    _openModal = () => {
        this.setState({ show_modal: true })
    }

    _handleCancel = () => {
        this.setState({ show_modal: false })
    }

    _handleShowLocation = () => {
        let { show_location } = this.state;
        show_location = !show_location;
        this.setState({ show_location })
    }

    _handleChooseLocation = (type) => {
        let { choose_location } = this.state;
        choose_location = type;
        this.setState({ choose_location });
    }

    _setArea = (item) => {
        this.setState({ area: item });
        localStorage.setItem("region", JSON.stringify(item))
        console.log(item)
    }

    _handleTabs = (key) => {
        switch (key) {
            case '1':
                this._handleShowDay('PARTTIME', true)
                break;
            case '2':
                this._handleShowDay('FULLTIME', false)
                break;
            case '3':
                this._handleShowDay('INTERNSHIP', false)
                break;

            default:
                break;
        }
    }

    listArea() {
        let { list_area } = this.state;
        return (
            <div className='choose-area'>
                <Select defaultValue={region ? region.name : 'Chọn tỉnh thành bạn muốn'} style={{ width: '100%' }}>
                    {list_area.map((item, index) => {
                        return <Option
                            id={item.id}
                            key={index}
                            value={item.name}
                            onClick={() => { this._setArea(item) }} >{item.name}</Option>
                    })}
                </Select>
            </div>)
    }

    _createRequest = () => {
        let {
            list_shift,
            list_day,
            location,
            choose_location,
            show_days,
            job_dto,
            jobType,
            area
        } = this.state;

        // {
        //     "employerID": "NULLABLE",
        //     "excludedJobIDs": [
        //       "string"
        //     ],
        //     "jobNameID": 0,
        //     "jobGroupID": 0,
        //     "jobType": "VALUES('PARTTIME', 'FULLTIME', 'INTERNSHIPSHIP')",
        //     "priority": "VALUES('NORMAL', 'HIGHLIGHT', 'TOP')",
        //     "excludePriority": "VALUES('NORMAL', 'HIGHLIGHT', 'TOP')",
        //     "shuffle": false,
        //     "jobShiftFilter": {
        //       "gender": "VALUES('MALE','FEMALE', 'BOTH', null)",
        //       "weekDays": "VALUES('MON','TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')",
        //       "dayTimes": "VALUES('MOR','AFT', 'EVN')"
        //     },
        //     "jobLocationFilter": {
        //       "regionID": "NULLABLE",
        //       "lat": 0,
        //       "lon": 0,
        //       "distance": 0
        //     }
        //   }

        let employerID = null;
        let excludedJobIDs = null;
        let excludePriority = null;
        let jobNameID = job_dto.id;
        let jobGroupID = null;
        let priority = 'NORMAL';
        let shuffle = true;
        let jobShiftFilter = {
            gender: 'BOTH',
            weekDays: [],
            dayTimes: []
        };

        let jobLocationFilter = {
            regionID: null,
            lat: 0,
            lon: 0,
            distance: 20000
        }

        if (show_days) {
            Object.keys(list_day).map((key) => {
                if (list_day[key] === true) {
                    jobShiftFilter.weekDays.push(key)
                }

                return null;
            });

            Object.keys(list_shift).map((key) => {
                if (list_shift[key] === true) {
                    jobShiftFilter.dayTimes.push(key)
                }

                return null;
            });
        } else {
            jobShiftFilter = null
        }

        if (choose_location === true) {
            jobLocationFilter.lat = location.marker.lat;
            jobLocationFilter.lon = location.marker.lng
        } else {
            jobLocationFilter.regionID = area.id;
            jobLocationFilter.lat = null;
            jobLocationFilter.lon = null;
        }

        this.requestToServer(
            {
                employerID,
                excludedJobIDs,
                priority,
                excludePriority,
                shuffle,
                jobNameID,
                jobGroupID,
                jobType,
                jobShiftFilter,
                jobLocationFilter
            }
        )
    }

    async requestToServer(data) {
        console.log(data)
        try {
            localStorage.setItem('searchData', JSON.stringify(data));
            localStorage.setItem('paging', JSON.stringify({ pageIndex: 0, pageSize: 10 }));
            this.props.searchJobDto(data);
            window.location.href = '/result';
        } catch (err) {
            throw err;
        }
    }

    componentWillUnmount() {
        this._isMounted = true;
    }

    render() {
        let { list_day,
            show_days,
            list_jobs,
            list_shift,
            show_modal,
            location,
            area,
            show_location,
            choose_location } = this.state;
        return (
            <React.Fragment>
                {/* Choose location modal */}
                <Modal
                    visible={show_modal}
                    title={choose_location ? 'Chọn vị trí' : 'Chọn khu vực'}
                    onOk={this._handleOk}
                    onCancel={this._handleCancel}
                    style={{ top: '10vh' }}
                    footer={[
                        <Button key="back" onClick={this._handleCancel}>
                            Trở lại
                        </Button>,
                        <Button key="submit" type="primary" onClick={this._handleOk}>
                            Cập nhật
                    </Button>]}
                >
                    {choose_location ?
                        <div>
                            <MapContainer />
                        </div> : this.listArea()}
                </Modal>

                <div className='search-area'>
                    {/* Search Box in Phone */}
                    <div className='search-box-phone show-only-phone'>
                        {/* Choose location address */}
                        <div className="location-address">
                            <Input
                                placeholder='Vị trí tìm việc của bạn'
                                prefix={<Icon type='environment' style={{ color: 'green' }} onClick={this._openModal} />}
                                value={choose_location ? location.address : area.name} />
                        </div>

                        <Select defaultValue='Chọn công việc cần tìm' style={{ width: '100%' }} size="default" >
                            {list_jobs && list_jobs.map((item, index) => {
                                return (<Option
                                    key={index}
                                    id={item.id}
                                    value={item.name}
                                    onClick={this._selectJob}

                                >{item.name + '  '}<span style={{ color: 'red' }} >({item.totalJobs})</span>
                                </Option>)
                            })}
                        </Select>
                        {/* Choose Type Job */}
                        <Tabs defaultActiveKey="1" onChange={this._handleTabs}>
                            <TabPane tab="Làm thêm" key="1" onClick={() => { this._handleShowDay(true, 'PARTTIME') }}>
                                <div className='choose-time' style={{ display: show_days === true ? 'block' : 'none' }}>
                                    <div className='choose-shift'>
                                        {list_day_times.map((item, index) => {
                                            return <Button
                                                id={item.shortcut}
                                                key={index}
                                                onClick={this._handleShift}
                                                style={{
                                                    background: list_shift[item.shortcut] ? '#67a7dc  ' : 'white',
                                                    color: list_shift[item.shortcut] ? 'white' : '#67a7dc'
                                                }}>
                                                {item.name}

                                            </Button>
                                        })}
                                    </div>
                                    {/* Choose day in week */}
                                    <div className='choose-day'>
                                        {list_week.map((item, index) => {
                                            return (
                                                <Button
                                                    id={item.shortcut}
                                                    key={index}
                                                    className='choose_btn'
                                                    onClick={this._handleTime}
                                                    style={{
                                                        background: list_day[item.shortcut] ? '#67a7dc  ' : 'white',
                                                        color: list_day[item.shortcut] ? 'white' : '#67a7dc  '
                                                    }}
                                                >{item.shortcut === 'SUN' ? 'CN' : 'T' + (index + 2)}</Button>)
                                        })}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="Chính thức" key="2" onClick={() => { this._handleShowDay(false, "FULLTIME") }}>
                            </TabPane>
                            <TabPane tab="Thực tập" key="3">
                            </TabPane>
                        </Tabs>
                        {/* Choose Area */}
                        <div className='find-area'>
                            <InputGroup>
                                <Select defaultValue="Option4" style={{ width: '80%' }} size="default" >
                                    <Option value="Option4" onClick={() => { this._handleChooseLocation(false) }}>Chọn khu vực</Option>
                                    <Option value="Option5" onClick={() => { this._handleChooseLocation(true) }}>Chọn vị trí</Option>
                                </Select>
                                <Button size='default'
                                    type='primary'
                                    style={{ width: '20%' }}
                                    onClick={this._openModal}
                                >
                                    <Icon type="environment" />
                                </Button>
                            </InputGroup>
                        </div>
                        <div className='find-now'>
                            <Button type='danger'
                                size='default'
                                onClick={this._createRequest}
                            >
                                <Icon type='search' />Tìm việc ngay
                         </Button>
                        </div>
                    </div>

                    {/* Search in Computer */}
                    <div className='search-box hidden-only-phone'>
                        {/* Choose Option */}
                        <div className='location-address'>
                            <InputGroup>
                                <Button type='primary' onClick={this._handleShowLocation}>{show_location ? 'Ẩn' : 'Xem chi tiết'}</Button>
                                <Input
                                    placeholder='Vị trí của bạn'
                                    value={choose_location ? location.address : area.name}
                                    style={{ width: show_location ? '500px' : '150px' }}
                                    prefix={<Icon type="environment" style={{ color: "green" }} />}
                                    readOnly />
                            </InputGroup>
                        </div>
                        <div className='search-type' style={{ marginTop: show_days ? '0px' : '100px' }}>
                            <InputGroup size="large" compact>
                                <Select className='primary' defaultValue="Option2" style={{ width: '20%' }} size="large" >
                                    <Option value="Option2" onClick={() => { this._handleShowDay('PARTTIME', true) }}>Làm thêm (PartTime)</Option>
                                    <Option value="Option1" onClick={() => { this._handleShowDay('FULLTIME', false) }}>Chính thức (FullTime)</Option>
                                    <Option value="Option3" onClick={() => { this._handleShowDay('INTERNSHIP', false) }}>Thực tập</Option>
                                </Select>
                                <Select defaultValue='Chọn công việc cần tìm' style={{ width: '35%' }} size="large" >
                                    {list_jobs && list_jobs.map((item, index) => {
                                        return (<Option key={index}
                                            id={item.id}
                                            value={item.name}
                                            onClick={this._selectJob}

                                        >{item.name + '  '}<span style={{ color: 'red' }} >({item.totalJobs})</span>
                                        </Option>)
                                    })}
                                </Select>
                                <Select defaultValue="Option4" style={{ width: '22%' }} size="large" >
                                    <Option value="Option4" onClick={() => { this._handleChooseLocation(false) }}>Chọn khu vực</Option>
                                    <Option value="Option5" onClick={() => { this._handleChooseLocation(true) }}>Chọn vị trí</Option>
                                </Select>
                                <Button size="large"
                                    type='primary'
                                    style={{ width: '23%' }}
                                    onClick={this._openModal}
                                >
                                    <Icon type="environment" color='green' />{choose_location ? 'Định vị bản đồ' : 'Chọn khu vực'}
                                </Button>
                            </InputGroup>
                        </div>
                        {/* Choose Time */}
                        <div className='choose-time' style={{ display: show_days === true ? 'block' : 'none' }}>
                            <div className='choose-shift'>
                                {list_day_times.map((item, index) => {
                                    return <Button
                                        id={item.shortcut}
                                        key={index}
                                        onClick={this._handleShift}
                                        style={{
                                            background: list_shift[item.shortcut] ? '#67a7dc  ' : 'white',
                                            color: list_shift[item.shortcut] ? 'white' : '#67a7dc'
                                        }}>
                                        {item.name}

                                    </Button>
                                })}
                            </div>
                            {/* Choose day in week */}
                            <div className='choose-day'>
                                {list_week.map((item, index) => {
                                    return (<Button
                                        id={item.shortcut}
                                        key={index}
                                        className='choose_btn'
                                        onClick={this._handleTime}
                                        style={{
                                            background: list_day[item.shortcut] ? '#67a7dc  ' : 'white',
                                            color: list_day[item.shortcut] ? 'white' : '#67a7dc  '
                                        }}>
                                        {item.name}</Button>)
                                })}
                            </div>
                        </div>
                        <div className='find-now'>
                            <Button type='danger' size='large' onClick={this._createRequest} ><Icon type='search' /> Tìm việc ngay</Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>

        );
    }
}

const mapStateToProps = state => {
    return {
        marker: state.handleMapState.marker,
        isAuthen: state.handleAuthState.isAuthen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        searchJobDto: (dto) => {
            dispatch({ type: SEARCH_JOB_DTO, dto })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
