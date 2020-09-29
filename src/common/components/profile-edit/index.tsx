import React, {Component} from "react";

import {Form, FormControl, InputGroup, Modal, Button, Spinner} from "react-bootstrap";

import {ActiveUser} from "../../store/active-user/types";
import {Account} from "../../store/accounts/types";

import UploadButton from "../image-upload-button";
import {error, success} from "../feedback";

import {_t} from "../../i18n";

import {updateProfile} from "../../api/operations";
import {getAccount} from "../../api/hive";

interface Props {
    activeUser: ActiveUser;
    addAccount: (data: Account) => void;
    updateActiveUser: (data?: Account) => void;
    onHide: () => void;
}

interface State {
    name: string,
    about: string,
    website: string,
    location: string,
    coverImage: string,
    profileImage: string,
    inProgress: boolean,
    uploading: boolean,
}

const pureState = (props: Props): State => {
    const profile = props.activeUser?.data?.profile!;

    return {
        uploading: false,
        inProgress: false,
        name: profile.name!,
        about: profile.about!,
        website: profile.website!,
        location: profile.location!,
        coverImage: profile.cover_image!,
        profileImage: profile.profile_image!,
    }
}

export class ProfileEdit extends Component<Props, State> {
    state: State = pureState(this.props);

    _mounted: boolean = true;

    componentWillUnmount() {
        this._mounted = false;
    }

    stateSet = (state: {}, cb?: () => void) => {
        if (this._mounted) {
            this.setState(state, cb);
        }
    };

    valueChanged = (e: React.ChangeEvent<FormControl & HTMLInputElement>): void => {
        const id = e.target.getAttribute('data-var') as string;
        const {value} = e.target;

        this.stateSet({[id]: value});
    };

    update = () => {
        const {activeUser, addAccount, updateActiveUser, onHide} = this.props;

        const {
            name,
            about,
            location,
            website,
            coverImage,
            profileImage
        } = this.state;

        const newProfile = {
            name,
            about,
            cover_image: coverImage,
            profile_image: profileImage,
            website,
            location
        };

        this.stateSet({inProgress: true});
        updateProfile(activeUser.data, newProfile).then(r => {
            success(_t('profile-edit.updated'));
            return getAccount(activeUser.username);
        }).then((account) => {
            // update reducers
            addAccount(account);
            updateActiveUser(account);

            // hide dialog
            onHide();
        }).catch(() => {
            error(_t('g.server-error'));
        }).finally(() => {
            this.stateSet({inProgress: false});
        });
    }

    render() {
        const {
            name,
            about,
            website,
            location,
            coverImage,
            profileImage,
            inProgress,
            uploading
        } = this.state;

        const spinner = <Spinner animation="grow" variant="light" size="sm" style={{marginRight: "6px"}}/>;

        return <div className="profile-edit-dialog-content">
            <Form.Group>
                <Form.Label>{_t('profile-edit.name')}</Form.Label>
                <Form.Control type="text" disabled={inProgress} value={name} maxLength={30} data-var="name" onChange={this.valueChanged}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>{_t('profile-edit.about')}</Form.Label>
                <Form.Control type="text" disabled={inProgress} value={about} maxLength={160} data-var="about" onChange={this.valueChanged}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>{_t('profile-edit.profile-image')}</Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control type="text" disabled={inProgress} placeholder="https://" value={profileImage} maxLength={500} data-var="profileImage"
                                  onChange={this.valueChanged}/>
                    <InputGroup.Append>
                        <UploadButton {...this.props}
                                      onBegin={() => {
                                          this.stateSet({uploading: true});
                                      }}
                                      onEnd={(url) => {
                                          this.stateSet({profileImage: url, uploading: false});
                                      }}/>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label>{_t('profile-edit.cover-image')}</Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control type="text" disabled={inProgress} placeholder="https://" value={coverImage} maxLength={500} data-var="coverImage" onChange={this.valueChanged}/>
                    <InputGroup.Append>
                        <UploadButton {...this.props}
                                      onBegin={() => {
                                          this.stateSet({uploading: true});
                                      }}
                                      onEnd={(url) => {
                                          this.stateSet({coverImage: url, uploading: false});
                                      }}/>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
            <Form.Group>
                <Form.Label>{_t('profile-edit.website')}</Form.Label>
                <Form.Control type="text" disabled={inProgress} placeholder="https://" value={website} maxLength={100} data-var="website" onChange={this.valueChanged}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>{_t('profile-edit.location')}</Form.Label>
                <Form.Control type="text" disabled={inProgress} value={location} maxLength={30} data-var="location" onChange={this.valueChanged}/>
            </Form.Group>
            <Button onClick={this.update} disabled={inProgress || uploading}>{inProgress && spinner} {_t('g.update')}</Button>
        </div>
    }
}

export default class ProfileEditDialog extends Component<Props> {
    render() {
        const {onHide} = this.props;
        return (
            <Modal animation={false} show={true} centered={true} onHide={onHide} keyboard={false} className="profile-edit-dialog modal-thin-header">
                <Modal.Header closeButton={true}/>
                <Modal.Body>
                    <ProfileEdit {...this.props} />
                </Modal.Body>
            </Modal>
        );
    }
}