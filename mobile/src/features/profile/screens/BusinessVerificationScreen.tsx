import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';

import type {
  RetailerStackParamList,
  SupplierStackParamList,
} from '../../../app/navigation/types';
import {FormTextField} from '../../../components/forms/FormTextField';
import {
  Badge,
  Button,
  Card,
  Icon,
  LoadingState,
  Screen,
  SubpageHero,
  Text,
} from '../../../components/ui';
import {appConfig} from '../../../config';
import {getAppApi} from '../../../services/api/createApi';
import {ApiClientError} from '../../../services/api/errors';
import {UDYAM_PATTERN} from '../../../services/api/businessVerificationApi';
import {colors} from '../../../theme/colors';
import {radii} from '../../../theme/radii';
import {spacing} from '../../../theme/spacing';
import {cardShell} from '../../../theme/surfaces';
import type {
  BusinessPhotoKind,
  BusinessVerificationProfile,
  BusinessVerificationStatus,
} from '../../../types';

type Props =
  | NativeStackScreenProps<RetailerStackParamList, 'BusinessVerification'>
  | NativeStackScreenProps<SupplierStackParamList, 'BusinessVerification'>;

const PHOTO_SLOTS: {
  kind: BusinessPhotoKind;
  title: string;
  hint: string;
  required: boolean;
}[] = [
  {
    kind: 'udyam_certificate',
    title: 'Udyam certificate',
    hint: 'Clear photo of your Udyam Aadhaar / registration certificate',
    required: true,
  },
  {
    kind: 'storefront',
    title: 'Store / warehouse front',
    hint: 'Phone photo of the business entrance or storefront',
    required: true,
  },
  {
    kind: 'interior',
    title: 'Business interior',
    hint: 'Optional photo of stock / trading floor',
    required: false,
  },
  {
    kind: 'signboard',
    title: 'Signboard',
    hint: 'Optional photo of business name board',
    required: false,
  },
];

const formSchema = z.object({
  udyamNumber: z
    .string()
    .trim()
    .refine(
      value => UDYAM_PATTERN.test(value.toUpperCase()),
      'Use format UDYAM-XX-00-0000000',
    ),
  businessTradeName: z
    .string()
    .trim()
    .min(2, 'Enter the trade name on your Udyam certificate'),
});

type FormValues = z.infer<typeof formSchema>;

type LocalPhotos = Partial<
  Record<BusinessPhotoKind, {uri: string; fileName?: string; type?: string}>
>;

function statusBadge(
  status: BusinessVerificationStatus,
): 'success' | 'warning' | 'info' | 'neutral' | 'error' {
  switch (status) {
    case 'verified':
      return 'success';
    case 'submitted':
    case 'under_review':
    case 'draft':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'neutral';
  }
}

function statusLabel(status: BusinessVerificationStatus): string {
  switch (status) {
    case 'not_started':
      return 'Not started';
    case 'draft':
      return 'Draft';
    case 'submitted':
      return 'Submitted';
    case 'under_review':
      return 'Under review';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
}

export function BusinessVerificationScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<BusinessVerificationProfile | null>(
    null,
  );
  const [photos, setPhotos] = useState<LocalPhotos>({});

  const {control, handleSubmit, reset} = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      udyamNumber: '',
      businessTradeName: '',
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (!appConfig.enableDevPreview) {
        setProfile({
          status: 'not_started',
          photos: [],
          lastUpdatedAt: new Date().toISOString(),
        });
        return;
      }
      const status = await getAppApi().businessVerification.getStatus();
      setProfile(status);
      if (status.udyamNumber || status.businessTradeName) {
        reset({
          udyamNumber: status.udyamNumber ?? '',
          businessTradeName: status.businessTradeName ?? '',
        });
      }
      const next: LocalPhotos = {};
      status.photos.forEach(photo => {
        if (photo.localUri) {
          next[photo.kind] = {
            uri: photo.localUri,
            fileName: photo.fileName,
            type: photo.mimeType,
          };
        }
      });
      setPhotos(next);
    } catch {
      setProfile({
        status: 'not_started',
        photos: [],
        lastUpdatedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    void load();
  }, [load]);

  const isVerified = profile?.status === 'verified';
  const missingRequired = useMemo(
    () =>
      PHOTO_SLOTS.filter(slot => slot.required).some(
        slot => !photos[slot.kind]?.uri,
      ),
    [photos],
  );

  const applyAsset = (kind: BusinessPhotoKind, asset?: Asset) => {
    if (!asset?.uri) {
      return;
    }
    setPhotos(current => ({
      ...current,
      [kind]: {
        uri: asset.uri!,
        fileName: asset.fileName ?? `${kind}.jpg`,
        type: asset.type ?? 'image/jpeg',
      },
    }));
  };

  const pickPhoto = (kind: BusinessPhotoKind) => {
    Alert.alert('Add phone photo', 'Capture with camera or choose from gallery.', [
      {
        text: 'Camera',
        onPress: () => {
          void launchCamera(
            {
              mediaType: 'photo',
              cameraType: 'back',
              quality: 0.8,
              saveToPhotos: false,
            },
            response => {
              if (response.didCancel || response.errorCode) {
                if (response.errorMessage) {
                  Alert.alert('Camera', response.errorMessage);
                }
                return;
              }
              applyAsset(kind, response.assets?.[0]);
            },
          );
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          void launchImageLibrary(
            {mediaType: 'photo', quality: 0.8, selectionLimit: 1},
            response => {
              if (response.didCancel || response.errorCode) {
                if (response.errorMessage) {
                  Alert.alert('Gallery', response.errorMessage);
                }
                return;
              }
              applyAsset(kind, response.assets?.[0]);
            },
          );
        },
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const onSubmit = handleSubmit(async values => {
    if (busy) {
      return;
    }
    if (missingRequired) {
      Alert.alert(
        'Photos required',
        'Add phone photos for Udyam certificate and storefront before submitting.',
      );
      return;
    }
    setBusy(true);
    try {
      if (!appConfig.enableDevPreview) {
        Alert.alert(
          'Backend required',
          'Business verification cannot be submitted until the Udyam + document upload contract is confirmed.',
        );
        return;
      }
      const photoPayload = PHOTO_SLOTS.filter(slot => photos[slot.kind]?.uri).map(
        slot => ({
          kind: slot.kind,
          localUri: photos[slot.kind]!.uri,
          fileName: photos[slot.kind]!.fileName,
          mimeType: photos[slot.kind]!.type,
        }),
      );
      const result = await getAppApi().businessVerification.submit({
        udyamNumber: values.udyamNumber.trim().toUpperCase(),
        businessTradeName: values.businessTradeName.trim(),
        photos: photoPayload,
      });
      setProfile(result);
      Alert.alert(
        'Business verified',
        'Udyam details and phone photos were accepted in development preview.',
      );
    } catch (error) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : 'Could not submit business verification.';
      Alert.alert('Submission failed', message);
    } finally {
      setBusy(false);
    }
  });

  return (
    <Screen scroll keyboardAvoiding backgroundColor={colors.background}>
      <SubpageHero
        title="Business verification"
        kicker="Udyam + photos"
        description="Confirm your MSME with Udyam Aadhaar and clear phone photos of the premises."
        icon="building"
        tone="copper"
        onBack={() => navigation.goBack()}
      />

      {loading || !profile ? (
        <LoadingState message="Loading business verification…" />
      ) : (
        <>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIcon}>
                <Icon
                  name={isVerified ? 'check' : 'building'}
                  color={isVerified ? 'accent' : 'primary'}
                  size={20}
                />
              </View>
              <View style={styles.flex}>
                <Text variant="h3">Business status</Text>
                <Text variant="caption" color="secondary">
                  Udyam Aadhaar verification
                </Text>
              </View>
              <Badge
                label={statusLabel(profile.status)}
                variant={statusBadge(profile.status)}
              />
            </View>
            {profile.udyamNumber ? (
              <Text variant="bodySmall" color="secondary" style={styles.meta}>
                {profile.udyamNumber}
              </Text>
            ) : null}
            {appConfig.enableDevPreview ? (
              <Text variant="caption" color="warning" style={styles.devNote}>
                Development preview — Udyam check and photo upload are fixtures,
                not live MSME / UIDAI services.
              </Text>
            ) : null}
          </Card>

          {isVerified ? (
            <Card style={styles.card}>
              <Text variant="bodySmall" color="secondary">
                Your business is verified with Udyam{' '}
                {profile.udyamNumber ?? 'on file'}
                {profile.businessTradeName
                  ? ` · ${profile.businessTradeName}`
                  : ''}
                . Re-submit only if registration details change.
              </Text>
            </Card>
          ) : (
            <>
              <Card style={styles.card}>
                <Text variant="label" style={styles.sectionLabel}>
                  Udyam Aadhaar
                </Text>
                <Text variant="bodySmall" color="secondary" style={styles.hint}>
                  Enter the registration number from your Udyam certificate
                  (format UDYAM-XX-00-0000000).
                </Text>
                <FormTextField
                  control={control}
                  name="udyamNumber"
                  label="Udyam number"
                  placeholder="UDYAM-MH-12-1234567"
                  autoCapitalize="characters"
                />
                <FormTextField
                  control={control}
                  name="businessTradeName"
                  label="Trade / business name"
                  placeholder="Name as on Udyam certificate"
                />
              </Card>

              <Card style={styles.card}>
                <Text variant="label" style={styles.sectionLabel}>
                  Phone photos
                </Text>
                <Text variant="bodySmall" color="secondary" style={styles.hint}>
                  Capture with your phone camera. Certificate and storefront are
                  required.
                </Text>
                {PHOTO_SLOTS.map(slot => {
                  const photo = photos[slot.kind];
                  return (
                    <View key={slot.kind} style={styles.photoSlot}>
                      <View style={styles.photoCopy}>
                        <Text variant="h3">
                          {slot.title}
                          {slot.required ? ' *' : ''}
                        </Text>
                        <Text variant="caption" color="secondary">
                          {slot.hint}
                        </Text>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${slot.title} photo`}
                        onPress={() => pickPhoto(slot.kind)}
                        style={({pressed}) => [
                          styles.photoBox,
                          pressed && styles.pressed,
                        ]}>
                        {photo?.uri ? (
                          <Image
                            source={{uri: photo.uri}}
                            style={styles.preview}
                          />
                        ) : (
                          <View style={styles.photoPlaceholder}>
                            <Icon name="camera" color="primary" size={22} />
                            <Text variant="caption" color="secondary">
                              Add photo
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    </View>
                  );
                })}
              </Card>

              <Button
                title="Submit business verification"
                fullWidth
                size="lg"
                loading={busy}
                onPress={() => void onSubmit()}
              />
            </>
          )}

          <Card style={styles.footerCard}>
            <Text variant="caption" color="secondary" align="center">
              Photos and Udyam details are sent to KDS compliance for review.
              Production uploads use the confirmed document API — never invent a
              live MSME success path in the client.
            </Text>
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {flex: 1, gap: 2},
  meta: {marginTop: spacing[1]},
  devNote: {marginTop: spacing[2], lineHeight: 18},
  card: {
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  sectionLabel: {marginBottom: spacing[1]},
  hint: {lineHeight: 20, marginBottom: spacing[1]},
  photoSlot: {
    gap: spacing[2],
    marginTop: spacing[2],
  },
  photoCopy: {gap: 2},
  photoBox: {
    ...cardShell,
    height: 140,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: spacing[2],
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pressed: {opacity: 0.9},
  footerCard: {
    marginTop: spacing[3],
    marginBottom: spacing[8],
  },
});
