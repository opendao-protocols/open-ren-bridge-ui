import React from 'react';
import Box from '3box';
import { ethers } from 'ethers'
import EthCrypto from 'eth-crypto'
import { createStore, withStore } from '@spyna/react-store'
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import { storeListener } from './services/storeService'

import NavContainer from './containers/NavContainer'
import TransferContainer from './containers/TransferContainer'
import ConfirmContainer from './containers/ConfirmContainer'
import IntroContainer from './containers/IntroContainer'

import DepositModalContainer from './containers/DepositModalContainer'
import CancelModalContainer from './containers/CancelModalContainer'
import ViewGatewayContainer from './containers/ViewGatewayContainer'
import NetworkModalContainer from './containers/NetworkModalContainer'
import TransactionsTableContainer from './containers/TransactionsTableContainer'

import { initDataWeb3, updateAllowance, updateBalance } from './utils/walletUtils'

import RenVM from './assets/renvm-powered.svg';
import Twitter from './assets/twitter.svg';
import Github from './assets/github.svg';
import Reddit from './assets/reddit.svg';
import Telegram from './assets/telegram.svg';


import { withStyles, ThemeProvider } from '@material-ui/styles';
import theme from './theme/theme'
import classNames from 'classnames'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table';

// import RenSDK from "@renproject/ren";
import GatewayJS from '@renproject/gateway'

import {
    ZBTC_MAIN,
    ZBTC_TEST,
    RENBTC_MAIN,
    RENBTC_TEST,
    RENZEC_MAIN,
    RENZEC_TEST,
    RENBCH_MAIN,
    RENBCH_TEST,
    WBTC_TEST,
    ADAPTER_MAIN,
    ADAPTER_TEST,
    BTC_SHIFTER_MAIN,
    BTC_SHIFTER_TEST,
    CURVE_TEST
} from './utils/web3Utils'

const styles = () => ({
  container: {
    // maxWidth: 450
    minHeight: '100vh'
  },
  contentContainer: {
    paddingTop: theme.spacing(3),
    flex: 1
  },
  footerContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    fontSize: 10,
    '& a': {
        color: '#333',
        marginRight: theme.spacing(2)
    }
  },
  footerLogo: {
    height: 12,
    width: 'auto',
    marginLeft: theme.spacing(0.5),
    // border: '1px solid ' + theme.palette.divider,
    // borderRadius: 4
  },
  transfersContainer: {
    padding: theme.spacing(3)
  },
})

const initialState = {
    // networking
    renBTCAddress: RENBTC_TEST,
    renZECAddress: RENZEC_TEST,
    renBCHAddress: RENBCH_TEST,

    btcShifterAddress: BTC_SHIFTER_TEST,
    adapterAddress: ADAPTER_TEST,
    selectedNetwork: 'testnet',

    // wallet & web3
    dataWeb3: null,
    localWeb3: null,
    localWeb3Address: '',
    localWeb3Network: '',
    box: null,
    space: null,
    spaceError: false,
    loadingBalances: true,
    renBTCBalance: 0,
    renZECBalance: 0,
    renBCHBalance: 0,
    ethBalance: 0,
    // sdk: new RenSDK("testnet"),
    gjs: new GatewayJS('testnet'),

    // navigation
    selectedTab: 1,
    selectedAsset: 'renbtc',
    confirmTx: null,
    confirmAction: '',

    // modals
    showNetworkMenu: false,
    showDepositModal: false,
    depositDisclosureChecked: false,
    showCancelModal: false,
    cancelModalTx: null,
    showGatewayModal: false,
    gatewayModalTx: null,
    showAboutModal: false,

    // conversions
    'convert.adapterAddress': ADAPTER_TEST,
    'convert.adapterWbtcAllowance': '',
    'convert.adapterWbtcAllowanceRequesting': '',
    'convert.transactions': [],
    'convert.pendingConvertToEthereum': [],
    'convert.selectedFormat': 'renbtc',
    'convert.selectedDirection': 0,
    'convert.amount': '',
    'convert.destination': '',
    'convert.destinationValid': false,
    'convert.exchangeRate': '',
    'convert.networkFee': '',
    'convert.conversionTotal': '',
}

class AppWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        initDataWeb3()
    }

    render() {
        const classes = this.props.classes
        const store = this.props.store
        storeListener(store)

        const localWeb3Address = store.get('localWeb3Address')
        const confirmAction = store.get('confirmAction')

        return (
          <ThemeProvider theme={theme}>
                <Grid container className={classes.container} direction='column'>
                    <NavContainer />
                    <Grid item className={classes.contentContainer}>
                        <Grid container justify='center' alignItems='center'>
                            {!localWeb3Address ? <Grid item xs={12} sm={8} md={6}>
                                <IntroContainer />
                            </Grid> :
                            <Grid item xs={12} sm={8} md={4}>
                                {confirmAction ? <ConfirmContainer /> : <TransferContainer />}
                            </Grid>}
                        </Grid>
                    </Grid>
                    <Grid container className={classes.footerContainer}>
                      <Container size='lg'>
                        <Grid container alignItems='center' justify='space-between'>
                            <Typography className={classes.footerLinks} variant='caption'><a target='_blank' href={'https://kovan.etherscan.io/address/' + ADAPTER_TEST}>What is RenVM?</a> <a target='_blank' href={'https://kovan.etherscan.io/address/' + CURVE_TEST}>Docs</a></Typography>
                            <Typography className={classes.footerLinks} variant='caption'>
                              <a target='_blank' href={'https://kovan.etherscan.io/address/' + ADAPTER_TEST}><img className={classes.footerLogo} src={Twitter} /></a>
                              <a target='_blank' href={'https://kovan.etherscan.io/address/' + ADAPTER_TEST}><img className={classes.footerLogo} src={Github} /></a>
                              <a target='_blank' href={'https://kovan.etherscan.io/address/' + ADAPTER_TEST}><img className={classes.footerLogo} src={Telegram} /></a>
                              <a target='_blank' href={'https://kovan.etherscan.io/address/' + ADAPTER_TEST}><img className={classes.footerLogo} src={Reddit} /></a>
                            </Typography>
                      </Grid>
                      </Container>
                    </Grid>
                </Grid>
          </ThemeProvider>
        );
    }
}

const AppWrapperComponent = withStore(AppWrapper)

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props
        return (
            <AppWrapperComponent classes={classes}/>
        );
    }
}

export default createStore(withStyles(styles)(App), initialState)
