import React, { Component } from 'react';
import { _get } from '../../../../service/base-api';
import { list_languages } from '../../../../service/api/public.api';
import { public_host } from '../../../../environment/development';

class ChooseLanguage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_show: false,
            language: {
                id: 1,
                name: 'Arabi',
            },
            list_language: []
        }

    }

    async componentWillMount() {
        let { list_language, language } = this.state;
        let res_language = await _get(null, list_languages, public_host);
        list_language = res_language.data.items;
        this.setState({ list_language, language });
    }

    _handleShowListLanguage = () => {
        let { is_show } = this.state;
        this.setState({ is_show: !is_show });
    }

    _chooseLanguage = (name, index) => {
        let { language } = this.state;
        language.name = name;
        language.id = index + 1;
        this.setState({ language });
        this._handleShowListLanguage();
    }

    render() {
        let { list_language, is_show, language } = this.state;
        let { indicative } = this.props;
        let icon_choose = <i className="fa fa-chevron-down"></i>;
        return (
            <div className='language-skills-ul'>
                <li onClick={this._handleShowListLanguage} style={{ borderBottom: "solid gray 1px" }}>
                    <label id={'language' + indicative}>
                        {language && language.name === '' ? 'chọn ngôn ngữ' : language.id + '.' + language.name}{icon_choose}
                    </label>
                </li>
                <div className='list_language' style={{ display: is_show === true ? 'block' : 'none' }}>
                    {list_language.map((item, index) => {
                        return <li key={index} onClick={() => { this._chooseLanguage(item.name, index) }}>{item.name}</li>
                    })}
                </div>
            </div>
        );
    }
}

export default ChooseLanguage;
