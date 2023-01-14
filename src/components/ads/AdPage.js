import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdId, deleteAd } from './service.js';
import Spinner from '../common/spinner/Spinner.js';
import styles from './AdsPage.module.css';
import ErrorDisplay from '../common/error/errorDisplay/ErrorDisplay.js';
import Button from '../common/Button.js';
import Confirm from '../common/confirm_element/Confirm.js';
import AdModel from './ad_model/AdModel.js';
import { useSelector } from 'react-redux';
import { getAdById } from '../../store/selectors.js';
const AdPage = () => {
  const { id } = useParams();

  const ad = useSelector(getAdById(id));
  console.log(ad)
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => setConfirm(true);

  const deletedAd = async () => {
    try {
      setIsFetching(true);

      await deleteAd(id);

      setIsDeleted(true);

      setIsFetching(false)

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err);
    }
  };

  const resetError = () => setError(null);

  // useEffect(() => {
  //   const getAd = async (id) => {
  //     try {
  //       resetError();
  //       const data = await getAdId(id);
  //       return data;
  //     } catch (err) {
  //       if (err.status === 404) {
  //         navigate('404');
  //       }
  //       setError(err);
  //     }
  //   };
  //   getAd(id);
  // }, [id, navigate]);

  return (
    <div className={styles.ads__page}>
      {!isFetching && isDeleted && <h1>Deleted Ad</h1>}
      {ad && !isDeleted ? (
        <div key={ad.id} className={styles.ad__container}>
          <AdModel ad={ad} />
          {!isDeleted && !confirm && (
            <Button variant='primary' onClick={handleConfirm}>
              Delete Ad
            </Button>
          )}
          {confirm && !isDeleted && (
            <Confirm
              children='Are you sure for delete ad?'
              confirm={deletedAd}
              notConfirm={() => setConfirm(false)}
            ></Confirm>
          )}
        </div>
      ) : (
        <Spinner />
      )}

      {error && <ErrorDisplay error={error} resetError={resetError} />}
      {isFetching && !isDeleted && (
        <div>
          <Spinner />

        </div>
      )}
    </div>
  );
};

export default AdPage;
