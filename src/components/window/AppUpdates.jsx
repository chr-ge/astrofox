import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/interface/Button';
import Checkmark from 'components/interface/Checkmark';
import Spinner from 'components/interface/Spinner';
import styles from './AppUpdates.less';

export default class AppUpdates extends React.Component {
    static contextTypes = {
        app: PropTypes.object,
    }

    constructor(props, context) {
        super(props);

        this.state = {
            message: null,
        };

        this.appUpdater = context.app.updater;
    }

    componentDidMount() {
        const {
            checking,
            downloading,
            downloadComplete,
        } = this.appUpdater;

        this.appUpdater.on('update', this.updateStatus, this);

        if (!checking && !downloading && !downloadComplete) {
            // Let css animation complete
            setTimeout(() => {
                this.appUpdater.checkForUpdates();
            }, 500);
        }

        this.updateStatus();
    }

    componentWillUnmount() {
        this.appUpdater.off('update', this.updateStatus, this);
    }

    updateStatus() {
        const {
            error,
            downloading,
            downloadComplete,
            installing,
            checking,
            hasUpdate,
            versionInfo,
        } = this.appUpdater;

        let message = 'You have the latest version.';

        if (error) {
            message = 'Unable to check for updates.';
        }
        else if (downloading) {
            message = 'Downloading update...';
        }
        else if (downloadComplete) {
            const { version } = versionInfo;
            message = `A new update (${version}) is ready to install.`;
        }
        else if (installing) {
            message = 'Installing update...';
        }
        else if (checking) {
            message = 'Checking for updates...';
        }
        else if (hasUpdate) {
            const { version } = versionInfo;
            message = `A new update (${version}) is available to download and install.`;
        }

        this.setState({ message });
    }

    installUpdate = () => {
        this.appUpdater.quitAndInstall();
    }

    downloadUpdate = () => {
        this.appUpdater.downloadUpdate();
    }

    render() {
        const { onClose } = this.props;
        const { message } = this.state;
        const {
            checking,
            installing,
            downloading,
            downloadComplete,
            hasUpdate,
        } = this.appUpdater;
        let icon;
        let installButton;
        let downloadButton;
        let closeText = 'Close';

        if (checking || downloading || installing) {
            icon = <Spinner className={styles.icon} size={30} />;
        }

        if (downloadComplete && !installing) {
            installButton = <Button text="Restart and Install Now" onClick={this.installUpdate} />;
            closeText = 'Install Later';
        }

        if (hasUpdate && !downloading && !downloadComplete) {
            downloadButton = <Button text="Download Now" onClick={this.downloadUpdate} />;
        }

        if (!hasUpdate && !icon) {
            icon = <Checkmark className={styles.icon} size={30} />;
        }

        return (
            <div>
                <div className={styles.message}>
                    {icon}
                    {message}
                </div>
                <div className={styles.buttons}>
                    {installButton}
                    {downloadButton}
                    <Button
                        className={styles.button}
                        text={closeText}
                        onClick={onClose}
                    />
                </div>
            </div>
        );
    }
}