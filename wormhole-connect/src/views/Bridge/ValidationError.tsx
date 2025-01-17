import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ValidationErr, getMinAmount } from '../../utils/transferValidation';
import AlertBanner from '../../components/AlertBanner';
import { PaymentOption } from '../../sdk';
import { makeStyles } from 'tss-react/mui';
import { setDestGasPayment } from '../../store/transfer';

const useStyles = makeStyles()((theme) => ({
  minAmtError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  link: {
    textDecoration: 'underline',
    opacity: '0.8',
    padding: '4px 0',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1',
    },
  },
}));

type Props = {
  validations: ValidationErr[];
  margin?: string;
};

function ValidationError(props: Props) {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const showErrors = useSelector((state: RootState) => state.transfer.validate);
  const { destGasPayment, toNativeToken, relayerFee } = useSelector(
    (state: RootState) => state.transfer,
  );
  const validationErrors = props.validations.filter((v) => !!v) as string[];
  const showError = validationErrors.length > 0;
  let content: React.ReactNode = validationErrors[0];

  const selectManual = () => {
    dispatch(setDestGasPayment(PaymentOption.MANUAL));
  };

  if (
    validationErrors[0] &&
    validationErrors[0].includes('Minimum amount is')
  ) {
    const isAutomatic = destGasPayment === PaymentOption.AUTOMATIC;
    const min = getMinAmount(isAutomatic, toNativeToken, relayerFee);
    content = (
      <div className={classes.minAmtError}>
        <div>
          Minimum amount is {min} for single transaction automatic transfers
        </div>
        <div className={classes.link} onClick={selectManual}>
          Switch to a manual claim transfer?
        </div>
      </div>
    );
  }

  return (
    <AlertBanner
      show={showErrors && showError}
      content={content}
      error
      margin={props.margin}
    />
  );
}

export default ValidationError;
